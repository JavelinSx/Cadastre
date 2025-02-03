// admins/admins.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { LoginDto } from 'auth/dto/login.dto';

@Controller('admins')
export class AdminsController {
  authService: any;
  constructor(private readonly adminsService: AdminsService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return this.authService.login(user);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get('profile')
  @UseGuards(AdminAuthGuard)
  async getProfile(@Req() req) {
    return this.adminsService.findByName(req.user.name);
  }
}
