import { Test, TestingModule } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './main';
import { UserService } from './user/user.service';

jest.spyOn(NestFactory, 'create').mockResolvedValue({
  get: jest.fn(),
  listen: jest.fn(),
} as any);

describe('Main.ts', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = module.get<UserService>(UserService);

    jest.spyOn(NestFactory, 'create').mockResolvedValueOnce({
      get: jest.fn().mockImplementation((service) => {
        if (service === UserService) return userService;
      }),
      listen: jest.fn(),
    } as any);

    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call createDefaultAdmin on bootstrap', async () => {
    const createDefaultAdminSpy = jest.spyOn(userService, 'createDefaultAdmin').mockResolvedValueOnce(null);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await bootstrap();

    expect(createDefaultAdminSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors in createDefaultAdmin gracefully', async () => {
    const createDefaultAdminSpy = jest.spyOn(userService, 'createDefaultAdmin').mockRejectedValueOnce(new Error('Test Error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await bootstrap();

    expect(createDefaultAdminSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create default admin:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
