import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../domain/enums/gender.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'budi@ikibisnis.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'uuid-of-role' })
  @IsNotEmpty()
  @IsUUID('4')
  roleId: string;

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt max
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ example: 'Password@123' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({ example: '08123456789' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 10, Jakarta' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  address: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'gender must be male or female' })
  gender: Gender;

  // ── Optional fields ──────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 'Bandung' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  birthPlace?: string;

  @ApiPropertyOptional({ example: '1995-07-17' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: '3273012345678901', description: '16-digit NIK' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{16}$/, { message: 'NIK must be exactly 16 digits' })
  nik?: string;

  @ApiPropertyOptional({ example: '123456789012345', description: '15-digit NPWP' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{15}$/, { message: 'NPWP must be exactly 15 digits' })
  npwp?: string;
}
