// cadastral.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CadastralService, CadastralServiceSchema } from './shemas/cadastral-service.schema';
import { CadastralController } from './cadastral.controller';
import { CadastralServiceService } from './cadastral.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CadastralService.name, schema: CadastralServiceSchema }])],
  controllers: [CadastralController],
  providers: [CadastralServiceService],
  exports: [CadastralServiceService],
})
export class CadastralModule {}
