// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admins/admins.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
    private jwtService: JwtService
  ) {}

  private isEmail(login: string): boolean {
    // Простая проверка на email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
  }

  private isPhone(login: string): boolean {
    // Простая проверка на телефон
    return /^\+?[\d\s-]{10,}$/.test(login);
  }

  async validateUser(login: string, password: string) {
    if (this.isEmail(login)) {
      // Ищем пользователя по email
      const user = await this.usersService.findByEmail(login);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return { ...result, type: 'user' };
      }
    } else if (this.isPhone(login)) {
      // Ищем пользователя по телефону
      const user = await this.usersService.findByPhone(login);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return { ...result, type: 'user' };
      }
    } else {
      // Пробуем найти админа по имени
      const admin = await this.adminsService.findByName(login);
      if (admin && (await bcrypt.compare(password, admin.password))) {
        const { password, ...result } = admin;
        return { ...result, type: 'admin' };
      }
    }

    return null;
  }

  // auth.service.ts
  async login(entity: any) {
    // Извлекаем _id и name из документа Mongoose
    const userId = entity._doc?._id || entity._id;
    const userName = entity._doc?.name || entity.name;

    const payload = {
      sub: userId,
      name: userName,
      type: 'admin',
    };

    const result = {
      access_token: this.jwtService.sign(payload),
      entity: {
        id: userId.toString(), // Преобразуем ObjectId в строку
        type: 'admin',
        name: userName,
      },
    };

    return result;
  }
}
