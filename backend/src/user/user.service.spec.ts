import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$mockedhashedpassword'),
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', role: 'USER' }]),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual([{ id: 1, email: 'user@example.com', role: 'USER' }]);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'user@example.com', role: 'USER' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const user = await service.findOne(1);
      expect(user).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, email: true, role: true },
      });
    });

    it('should throw an exception if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        select: { id: true, email: true, role: true },
      });
    });
  });

  describe('createDefaultAdmin', () => {
    it('should not create an admin if one already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ email: 'admin@teste.com' });

      await service.createDefaultAdmin();
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should create an admin if none exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      mockPrismaService.user.create.mockResolvedValue({
        email: 'admin@teste.com',
        password: hashedPassword,
        role: 'ADMIN',
      });

      await service.createDefaultAdmin();
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'admin@teste.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    });
  });

  describe('createUser', () => {
    it('should throw an exception if the user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ email: 'user@example.com' });

      await expect(
        service.createUser('user@example.com', 'password123'),
      ).rejects.toThrow(new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST));
    });

    it('should create a new user if email is unique', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
      });

      const user = await service.createUser('user@example.com', 'password123');
      expect(user).toEqual({
        id: 1,
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER',
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          role: Role.USER,
        },
      });
    });
  });
});
