import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AdminLoginDto } from '../../auth/dto/auth.login-admin.dto';
import { AdminAuthService } from '../../auth/services/auth.service.admin';

// auth/controllers/admin-auth.controller.ts
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AdminLoginDto) {
    const admin = await this.adminAuthService.validateAdmin(loginDto.login, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.adminAuthService.login(admin);
  }
}
