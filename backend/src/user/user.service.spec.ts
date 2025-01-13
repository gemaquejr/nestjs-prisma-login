import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from './role.enum';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', role: 'USER' }]), // Mock do findMany
      create: jest.fn().mockResolvedValue({ id: 1, email: 'user@example.com', role: 'USER' }),
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
    it('findAll should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual([{ id: 1, email: 'user@example.com', role: 'USER' }]);
    });
  });
});
