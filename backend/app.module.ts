// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    // Глобальная конфигурация ConfigModule
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigModule глобально доступным
      envFilePath: '.env',
    }),

    // Настройка подключения к MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // Подключаем модули приложения
    AuthModule,
    UsersModule,
    AdminsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
