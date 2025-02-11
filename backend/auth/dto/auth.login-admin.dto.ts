// dto/admin-login.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @MinLength(10)
  password: string;
}
