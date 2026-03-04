import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../user/domain/enums/gender.enum';

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
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 3600, description: 'Expiry in seconds' })
  expiresIn: number;

  @ApiProperty()
  user: AuthUserDto;
}
