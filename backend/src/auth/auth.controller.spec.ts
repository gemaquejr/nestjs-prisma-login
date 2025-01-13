import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
  },
};

const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a mock token when valid credentials are provided', async () => {
      const body = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashedpassword', role: 'USER' };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue({ access_token: 'mockToken' });

      const result = await controller.login(body);

      expect(result).toEqual({ access_token: 'mockToken' });
      expect(authService.validateUser).toHaveBeenCalledWith(body.email, body.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if invalid credentials are provided', async () => {
      const body = { email: 'test@test.com', password: 'wrongpassword' };

      mockAuthService.validateUser.mockRejectedValue(new UnauthorizedException('Email ou senha inválidos'));

      try {
        await controller.login(body);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Email ou senha inválidos');
      }
    });
  });
});
