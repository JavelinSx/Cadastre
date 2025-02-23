// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersAdminController } from './users.admin.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { CadastralService, CadastralServiceSchema } from 'cadastral/shemas/cadastral-service.schema';
import { CadastralModule } from 'cadastral/cadastral.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CadastralService.name, schema: CadastralServiceSchema },
    ]),
    CadastralModule,
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
