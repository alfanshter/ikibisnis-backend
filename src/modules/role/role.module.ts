import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

// Domain
import { IRoleRepository } from './domain/repositories/role.repository.interface';

// Infrastructure
import { RoleOrmEntity } from './infrastructure/orm/role.orm-entity';
import { RoleRepository } from './infrastructure/repositories/role.repository';

// Application — Use Cases
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { GetRoleByIdUseCase } from './application/use-cases/get-role-by-id.use-case';
import { GetAllRolesUseCase } from './application/use-cases/get-all-roles.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { ToggleRoleStatusUseCase } from './application/use-cases/toggle-role-status.use-case';

// Presentation
import { RoleController } from './presentation/role.controller';

// Common
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { PermissionGuard } from '../../common/guards/permission.guard';

const USE_CASES = [
  CreateRoleUseCase,
  UpdateRoleUseCase,
  GetRoleByIdUseCase,
  GetAllRolesUseCase,
  DeleteRoleUseCase,
  ToggleRoleStatusUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([RoleOrmEntity])],
  controllers: [RoleController],
  providers: [
    // Bind the abstract port to its concrete implementation (DIP)
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
    // Make Reflector available for guards and interceptors
    Reflector,
    ResponseInterceptor,
    PermissionGuard,
    ...USE_CASES,
  ],
  exports: [IRoleRepository],
})
export class RoleModule {}
