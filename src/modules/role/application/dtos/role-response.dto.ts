import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/entities/role.entity';

export class PermissionResponseDto {
  @ApiProperty({ example: 'finance_report' })
  feature: string;

  @ApiProperty({ example: ['read', 'write'] })
  actions: string[];
}

export class RoleResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Finance Manager' })
  name: string;

  @ApiProperty({ example: 'Manages all financial reports' })
  description: string;

  @ApiProperty({ example: '#4F46E5' })
  badgeColor: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(role: Role): RoleResponseDto {
    const dto = new RoleResponseDto();
    dto.id = role.id;
    dto.name = role.name;
    dto.description = role.description;
    dto.badgeColor = role.badgeColor;
    dto.isActive = role.isActive;
    dto.permissions = role.permissions.map((p) => p.toPlainObject());
    dto.createdAt = role.createdAt;
    dto.updatedAt = role.updatedAt;
    return dto;
  }
}

export class PaginatedRoleResponseDto {
  @ApiProperty({ type: [RoleResponseDto] })
  data: RoleResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
