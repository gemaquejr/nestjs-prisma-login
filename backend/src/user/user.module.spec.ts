import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

// Criando um mock para o PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  },
};

describe('UserModule', () => {
  let module: TestingModule;
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userController).toBeDefined();
  });
});
