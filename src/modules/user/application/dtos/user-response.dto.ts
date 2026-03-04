import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';
import { Gender } from '../../domain/enums/gender.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Budi Santoso' })
  fullName: string;

  @ApiProperty({ example: 'budi@ikibisnis.com' })
  email: string;

  @ApiProperty({ example: 'uuid-of-role' })
  roleId: string;

  @ApiPropertyOptional({ example: 'Finance Manager', nullable: true })
  roleName: string | null;

  @ApiProperty({ example: '08123456789' })
  phone: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 10, Jakarta' })
  address: string;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiPropertyOptional({ nullable: true })
  birthPlace: string | null;

  @ApiPropertyOptional({ nullable: true })
  birthDate: Date | null;

  @ApiPropertyOptional({ nullable: true })
  nik: string | null;

  @ApiPropertyOptional({ nullable: true })
  npwp: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.fullName = user.fullName;
    dto.email = user.email;
    dto.roleId = user.roleId;
    dto.roleName = user.roleName;
    dto.phone = user.phone;
    dto.address = user.address;
    dto.gender = user.gender;
    dto.birthPlace = user.birthPlace;
    dto.birthDate = user.birthDate;
    dto.nik = user.nik;
    dto.npwp = user.npwp;
    dto.isActive = user.isActive;
    dto.lastLoginAt = user.lastLoginAt;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
