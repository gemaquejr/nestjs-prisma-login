// app.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should import all required modules', () => {
    const authModule = appModule.get(AuthModule);
    const userModule = appModule.get(UserModule);
    const prismaModule = appModule.get(PrismaModule);

    expect(authModule).toBeDefined();
    expect(userModule).toBeDefined();
    expect(prismaModule).toBeDefined();
  });

  it('should have AppService and AppController', () => {
    const appService = appModule.get(AppService);
    const appController = appModule.get(AppController);

    expect(appService).toBeDefined();
    expect(appController).toBeDefined();
  });
});
