import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../../common/guards/permission.guard';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';
import { FeatureAction } from '../../role/domain/enums/feature-action.enum';
import { SystemFeature } from '../../role/domain/enums/system-feature.enum';
import { CreateProjectDto } from '../application/dtos/create-project.dto';
import { ProjectQueryDto } from '../application/dtos/project-query.dto';
import { ProjectResponseDto } from '../application/dtos/project-response.dto';
import { PaginatedProjectResponseDto } from '../application/dtos/project-list-response.dto';
import { CreateProjectUseCase } from '../application/use-cases/create-project.use-case';
import { GetAllProjectsUseCase } from '../application/use-cases/get-all-projects.use-case';
import { GetProjectByIdUseCase } from '../application/use-cases/get-project-by-id.use-case';
import type { JwtPayload } from '../../auth/infrastructure/strategies/jwt.strategy';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller({ path: 'projects', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProjectController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly getAllProjects: GetAllProjectsUseCase,
    private readonly getProjectById: GetProjectByIdUseCase,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Proyek berhasil dibuat')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @RequirePermission(SystemFeature.PROJECTS, FeatureAction.WRITE)
  @ApiOperation({ summary: 'Tambah proyek baru' })
  @ApiResponse({ status: 201, type: ProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — insufficient permission',
  })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async create(
    @Body() dto: CreateProjectDto,
    @Request() req: { user: JwtPayload },
  ): Promise<ProjectResponseDto> {
    return this.createProject.execute(dto, req.user.sub);
  }

  // ─── GET ALL ─────────────────────────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Daftar proyek berhasil diambil')
  @RequirePermission(SystemFeature.PROJECTS, FeatureAction.READ)
  @ApiOperation({ summary: 'Ambil daftar proyek (dengan pagination & filter)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['baru', 'proses', 'pending', 'selesai', 'dibayar', 'dibatalkan'],
  })
  @ApiQuery({ name: 'kategori', required: false, type: String })
  @ApiQuery({
    name: 'tipePembayaran',
    required: false,
    enum: ['reguler', 'termin', 'sewa'],
  })
  @ApiQuery({
    name: 'prioritas',
    required: false,
    enum: ['rendah', 'sedang', 'tinggi'],
  })
  @ApiResponse({ status: 200, type: PaginatedProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — insufficient permission',
  })
  async getAll(
    @Query() query: ProjectQueryDto,
  ): Promise<PaginatedProjectResponseDto> {
    return this.getAllProjects.execute(query);
  }

  // ─── GET BY ID ───────────────────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Detail proyek berhasil diambil')
  @RequirePermission(SystemFeature.PROJECTS, FeatureAction.READ)
  @ApiOperation({ summary: 'Ambil detail proyek berdasarkan ID' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — insufficient permission',
  })
  @ApiResponse({ status: 404, description: 'Proyek tidak ditemukan' })
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ProjectResponseDto> {
    return this.getProjectById.execute(id);
  }
}
