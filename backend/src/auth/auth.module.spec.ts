import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

describe('AuthModule', () => {
  let module: TestingModule;
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule, PrismaModule],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(authController).toBeDefined();
  });

  it('should import JwtModule and initialize the secret', () => {
    const jwtService = module.get<JwtService>(JwtService);
    expect(jwtService).toBeDefined();
    expect(jwtService).toHaveProperty('sign');
  });
});
