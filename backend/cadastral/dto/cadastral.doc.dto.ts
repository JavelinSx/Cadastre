import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from 'types/documents';

// DTO для обновления документа
export class UpdateDocumentStatusDto {
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
