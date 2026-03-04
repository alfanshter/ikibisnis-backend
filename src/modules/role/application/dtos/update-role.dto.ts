import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PermissionItemDto } from './create-role.dto';

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Finance Manager' })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'Manages financial reports' })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ example: '#4F46E5' })
  @IsOptional()
  @IsNotEmpty()
  badgeColor?: string;

  @ApiPropertyOptional({ type: [PermissionItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions?: PermissionItemDto[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
