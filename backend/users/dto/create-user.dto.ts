// users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Неверный формат телефона' })
  phone?: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty({ message: 'Необходимо указать email или телефон' })
  @IsString()
  message = 'Необходимо указать email или телефон';

  @IsString()
  @MinLength(10, { message: 'Пароль должен содержать минимум 10 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/, {
    message: 'Пароль должен содержать буквы и цифры',
  })
  password: string;
}
