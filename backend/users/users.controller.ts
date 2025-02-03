// src/users/users.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { AdminAuthGuard } from '../guards/admin-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(UserAuthGuard)
  async getProfile(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    const { password, ...result } = user;
    return result;
  }
}
