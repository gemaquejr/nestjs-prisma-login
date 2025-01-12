import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Post('create')
  async createUser(
    @Body() body: { email: string; password: string; role: string },
  ) {
    return this.userService.createUser(body.email, body.password);
  }
}
