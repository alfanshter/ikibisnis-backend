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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';
import { CreateUserDto } from '../application/dtos/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from '../application/dtos/update-user.dto';
import { UserQueryDto } from '../application/dtos/user-query.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from '../application/dtos/user-response.dto';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UpdateUserUseCase, ChangePasswordUseCase } from '../application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../application/use-cases/get-all-users.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { ToggleUserStatusUseCase } from '../application/use-cases/toggle-user-status.use-case';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly toggleUserStatus: ToggleUserStatusUseCase,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User berhasil dibuat')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation / password mismatch error' })
  @ApiResponse({ status: 409, description: 'Email / NIK / NPWP already used' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUser.execute(dto);
  }

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Users retrieved successfully')
  @ApiOperation({ summary: 'Get all users (paginated, filterable)' })
  @ApiResponse({ status: 200, type: PaginatedUserResponseDto })
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedUserResponseDto> {
    return this.getAllUsers.execute(query);
  }

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User retrieved successfully')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto> {
    return this.getUserById.execute(id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User berhasil diperbarui')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update user data' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email / NIK / NPWP conflict' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.updateUser.execute(id, dto);
  }

  // ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────

  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password berhasil diperbarui')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Change user password' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 400, description: 'Wrong current password / mismatch' })
  async changePass(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.changePassword.execute(id, dto);
  }

  // ─── TOGGLE STATUS ───────────────────────────────────────────────────────────

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Status user berhasil diubah')
  @ApiOperation({ summary: 'Toggle user active/inactive status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async toggle(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto> {
    return this.toggleUserStatus.execute(id);
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User berhasil dihapus')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Permanently delete a user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    return this.deleteUser.execute(id);
  }
}
