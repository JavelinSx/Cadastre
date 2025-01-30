// users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  login: string; // Может быть email, телефон или имя админа

  @IsString()
  @MinLength(6)
  password: string;
}
