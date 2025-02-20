// strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AdminsService } from '../../admins/admins.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../types/auth.types';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const data = request?.cookies['auth_token'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const entity =
      payload.role === 'admin'
        ? await this.adminsService.findById(payload.sub)
        : await this.usersService.findById(payload.sub);

    if (!entity) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      role: payload.role,
      ...(payload.role === 'admin' ? { login: payload.login } : { email: payload.email }),
    };
  }
}
