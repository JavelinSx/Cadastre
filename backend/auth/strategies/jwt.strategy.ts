// strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AdminsService } from '../../admins/admins.service';
import { JwtPayload } from '../../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const entity =
      payload.type === 'admin'
        ? await this.adminsService.findById(payload.sub)
        : await this.usersService.findById(payload.sub);

    if (!entity) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      type: payload.type,
      ...(payload.type === 'admin' ? { name: payload.name } : { email: payload.email }),
    };
  }
}
