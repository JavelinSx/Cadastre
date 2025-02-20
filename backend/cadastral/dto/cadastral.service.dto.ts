import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CadastralServiceType } from 'types/cadastral';

// DTO для создания услуги
export class CreateServiceDto {
  @IsEnum(CadastralServiceType)
  type: CadastralServiceType;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
