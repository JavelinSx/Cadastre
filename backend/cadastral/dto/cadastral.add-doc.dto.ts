// cadastral/dto/add-document.dto.ts
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentStatus } from '../../types/documents';

export class AddDocumentDto {
  @IsString()
  type: string;

  @IsBoolean()
  isRequired: boolean;

  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}
