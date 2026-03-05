import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../../common/guards/permission.guard';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';
import { FeatureAction } from '../domain/enums/feature-action.enum';
import { SystemFeature } from '../domain/enums/system-feature.enum';
import { CreateRoleDto } from '../application/dtos/create-role.dto';
import {
  PaginatedRoleResponseDto,
  RoleResponseDto,
} from '../application/dtos/role-response.dto';
import { RoleQueryDto } from '../application/dtos/role-query.dto';
import { UpdateRoleDto } from '../application/dtos/update-role.dto';
import { CreateRoleUseCase } from '../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../application/use-cases/delete-role.use-case';
import { GetAllRolesUseCase } from '../application/use-cases/get-all-roles.use-case';
import { GetRoleByIdUseCase } from '../application/use-cases/get-role-by-id.use-case';
import { ToggleRoleStatusUseCase } from '../application/use-cases/toggle-role-status.use-case';
import { UpdateRoleUseCase } from '../application/use-cases/update-role.use-case';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller({ path: 'roles', version: '1' })
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RoleController {
  constructor(
    private readonly createRole: CreateRoleUseCase,
    private readonly updateRole: UpdateRoleUseCase,
    private readonly getRoleById: GetRoleByIdUseCase,
    private readonly getAllRoles: GetAllRolesUseCase,
    private readonly deleteRole: DeleteRoleUseCase,
    private readonly toggleRoleStatus: ToggleRoleStatusUseCase,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Role created successfully')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.WRITE)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, type: RoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.createRole.execute(dto);
  }

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Roles retrieved successfully')
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.READ)
  @ApiOperation({ summary: 'Get all roles (paginated, filterable)' })
  @ApiResponse({ status: 200, type: PaginatedRoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  async findAll(
    @Query() query: RoleQueryDto,
  ): Promise<PaginatedRoleResponseDto> {
    return this.getAllRoles.execute(query);
  }

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Role retrieved successfully')
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.READ)
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<RoleResponseDto> {
    return this.getRoleById.execute(id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Role updated successfully')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.UPDATE)
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.updateRole.execute(id, dto);
  }

  // ─── TOGGLE STATUS ───────────────────────────────────────────────────────────

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Role status toggled successfully')
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.UPDATE)
  @ApiOperation({ summary: 'Toggle role active/inactive status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  async toggle(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<RoleResponseDto> {
    return this.toggleRoleStatus.execute(id);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Role deleted successfully')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.DELETE)
  @ApiOperation({ summary: 'Permanently delete a role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient permission' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    return this.deleteRole.execute(id);
  }
}
