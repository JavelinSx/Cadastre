import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // Очищаем и форматируем телефон перед валидацией
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('8')) {
      return '7' + cleaned.slice(1);
    }
    return cleaned.startsWith('7') ? cleaned : '7' + cleaned;
  })
  @Matches(/^7\d{10}$/, {
    message: 'Неверный формат телефона',
  })
  phone?: string;
}
