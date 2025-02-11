// dto/user-login.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;
}
