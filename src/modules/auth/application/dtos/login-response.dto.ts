import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../user/domain/enums/gender.enum';

/**
 * Satu entri permission fitur beserta aksi yang diizinkan.
 * Digunakan frontend untuk lock/unlock fitur secara granular.
 */
export class PermissionDto {
  @ApiProperty({
    example: 'user_management_roles',
    description: 'Kode fitur sistem',
  })
  feature: string;

  @ApiProperty({
    example: ['read', 'write', 'update', 'delete'],
    description:
      'Daftar aksi yang diizinkan pada fitur ini (read/write/update/delete)',
    isArray: true,
    type: String,
  })
  actions: string[];
}

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty({ nullable: true })
  roleName: string | null;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty({
    type: [PermissionDto],
    description:
      'Daftar permission role yang sedang login. Gunakan ini di frontend untuk lock/unlock menu & tombol.',
    example: [
      { feature: 'dashboard', actions: ['read'] },
      {
        feature: 'user_management_roles',
        actions: ['read', 'write', 'update', 'delete'],
      },
      { feature: 'projects', actions: ['read', 'write'] },
    ],
  })
  permissions: PermissionDto[];
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 3600, description: 'Expiry in seconds' })
  expiresIn: number;

  @ApiProperty()
  user: AuthUserDto;
}
