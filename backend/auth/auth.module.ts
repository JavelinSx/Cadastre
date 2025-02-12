// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

// Services
import { AdminAuthService } from './services/auth.service.admin';
import { UserAuthService } from './services/auth.service.user';

// Controllers
import { AdminAuthController } from './controllers/auth.controller.admin';
import { UserAuthController } from './controllers/auth.controller.user';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminAuthGuard } from './guards/auth.admin.guard';
import { UserAuthGuard } from './guards/auth.user.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AdminsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d',
        },
      }),
    }),
  ],
  providers: [
    // Services
    AdminAuthService,
    UserAuthService,

    // Strategy
    JwtStrategy,

    // Guards
    JwtAuthGuard,
    AdminAuthGuard,
    UserAuthGuard,
  ],
  controllers: [AdminAuthController, UserAuthController],
  exports: [JwtAuthGuard, AdminAuthGuard, UserAuthGuard],
})
export class AuthModule {}
