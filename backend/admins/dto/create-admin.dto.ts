import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @MinLength(10)
  password: string;

  readonly role: string = 'admin';
}
