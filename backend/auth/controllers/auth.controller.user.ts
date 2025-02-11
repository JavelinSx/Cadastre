// auth/controllers/user-auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from 'auth/dto/auth.login-user.dto';
import { UserAuthService } from 'auth/services/auth.service.user';

@Controller('auth/users')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: UserLoginDto) {
    const user = await this.userAuthService.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.userAuthService.login(user);
  }
}
