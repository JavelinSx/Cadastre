import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from 'types/cadastral';

// DTO для обновления статуса услуги
export class UpdateServiceStatusDto {
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
