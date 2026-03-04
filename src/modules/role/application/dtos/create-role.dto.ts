import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { FeatureAction } from '../../domain/enums/feature-action.enum';
import { SystemFeature } from '../../domain/enums/system-feature.enum';

export class PermissionItemDto {
  @ApiProperty({
    enum: SystemFeature,
    example: SystemFeature.LAPORAN_HARIAN,
    description: 'The feature/module being granted permission',
  })
  @IsEnum(SystemFeature)
  feature: SystemFeature;

  @ApiProperty({
    enum: FeatureAction,
    isArray: true,
    example: [FeatureAction.READ, FeatureAction.WRITE],
    description: 'One or more actions to allow on this feature',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(FeatureAction, { each: true })
  actions: FeatureAction[];
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Project Manager', description: 'Unique role name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Mengelola semua proyek dan penawaran',
    description: 'Role description',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '#4F46E5',
    description: 'Badge color in HEX format (e.g. #FF5733)',
  })
  @IsNotEmpty()
  badgeColor: string;

  @ApiProperty({
    type: [PermissionItemDto],
    description: 'List of feature permissions assigned to this role',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionItemDto)
  permissions: PermissionItemDto[];
}
