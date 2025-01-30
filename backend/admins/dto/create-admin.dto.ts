// admins/dto/create-admin.dto.ts
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Username can only contain letters, numbers, underscores and dashes',
  })
  name: string;

  @IsString()
  @MinLength(10)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
