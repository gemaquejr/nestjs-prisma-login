import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  try {
    await userService.createDefaultAdmin();
  } catch (error) {
    console.error('Failed to create default admin:', error);
  }
  await app.listen(3000);
}
bootstrap();
