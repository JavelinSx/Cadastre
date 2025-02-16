// auth/controllers/auth.controller.admin.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AdminLoginDto } from '../dto/auth.login-admin.dto';
import { AdminAuthService } from '../services/auth.service.admin';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AdminLoginDto, @Res({ passthrough: true }) response: Response) {
    const admin = await this.adminAuthService.validateAdmin(loginDto.login, loginDto.password);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authResponse = await this.adminAuthService.login(admin);

    // Устанавливаем httpOnly куки
    response.cookie('auth_token', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/',
    });

    return authResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('auth_token');
    return { message: 'Logged out successfully' };
  }
}
