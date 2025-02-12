// auth/services/user-auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, JwtPayload, UserEntity } from 'types/auth.types';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private isEmail(login: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
  }

  private isPhone(login: string): boolean {
    return /^\+?[\d\s-]{10,}$/.test(login);
  }

  async validateUser(login: string, password: string): Promise<UserEntity | null> {
    let user;

    if (this.isEmail(login)) {
      user = await this.usersService.findByEmail(login);
    } else if (this.isPhone(login)) {
      user = await this.usersService.findByPhone(login);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return {
        id: user._id.toString(),
        role: 'user',
        email: user.email,
        phone: user.phone,
      };
    }
    return null;
  }

  async login(user: UserEntity): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      role: 'user',
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      entity: user,
    };
  }
}
