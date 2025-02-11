// src/users/users.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAuthGuard } from '../guards/user-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(UserAuthGuard)
  async getProfile(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    const { password, ...result } = user;
    return result;
  }
}
