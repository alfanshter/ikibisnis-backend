import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'budi@ikibisnis.com' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong.' })
  @IsEmail({}, { message: 'Format email tidak valid.' })
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsNotEmpty({ message: 'Password tidak boleh kosong.' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
