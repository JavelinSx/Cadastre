// auth/services/admin-auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../../admins/admins.service';
import type { AdminEntity, AuthResponse, JwtPayload } from '../../types/auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService
  ) {}

  async validateAdmin(login: string, password: string): Promise<AdminEntity | null> {
    const admin = await this.adminsService.findByLogin(login);

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const adminJson = admin.toJSON();
      return {
        id: adminJson.id,
        role: 'admin',
        login: adminJson.login,
      };
    }
    return null;
  }

  async login(admin: AdminEntity): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: admin.id,
      role: 'admin',
      login: admin.login,
    };

    return {
      access_token: this.jwtService.sign(payload),
      entity: admin,
    };
  }
}
