import { Body, Controller, HttpCode, HttpStatus, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserLoginDto } from '../dto/auth.login-user.dto';
import { UserAuthService } from '../services/auth.service.user';

@Controller('auth/users')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.userAuthService.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authResponse = await this.userAuthService.login(user);

    response.cookie('auth_token', authResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost',
    });

    return authResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost',
    });
    return { message: 'Logged out successfully' };
  }
}
