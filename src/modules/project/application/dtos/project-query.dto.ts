import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { ProjectPriority } from '../../domain/enums/project-priority.enum';
import { PaymentType } from '../../domain/enums/payment-type.enum';

/**
 * Query parameters for GET /v1/projects.
 * All fields are optional — omit to return unfiltered results.
 */
export class ProjectQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Free-text search on judul proyek or nama client',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ProjectStatus,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'Filter by kategori proyek',
  })
  @IsOptional()
  @IsString()
  kategori?: string;

  @ApiPropertyOptional({
    description: 'Filter by tipe pembayaran (tab filter)',
    enum: PaymentType,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  tipePembayaran?: PaymentType;

  @ApiPropertyOptional({
    description: 'Filter by prioritas',
    enum: ProjectPriority,
  })
  @IsOptional()
  @IsEnum(ProjectPriority)
  prioritas?: ProjectPriority;
}
