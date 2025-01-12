import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async createDefaultAdmin() {
    const admin = await this.prisma.user.findUnique({
      where: { email: 'admin@teste.com' },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await this.prisma.user.create({
        data: {
          email: 'admin@teste.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Administrador criado com sucesso!');
    }
  }

  async createUser(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        role: 'USER',
      },
    });
    return user;
  }
}
