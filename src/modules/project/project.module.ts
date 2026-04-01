import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

// Domain
import { IProjectRepository } from './domain/repositories/project.repository.interface';

// Infrastructure
import { ProjectOrmEntity } from './infrastructure/orm/project.orm-entity';
import { ProjectRepository } from './infrastructure/repositories/project.repository';

// Application — Use Cases
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { GetAllProjectsUseCase } from './application/use-cases/get-all-projects.use-case';
import { GetProjectByIdUseCase } from './application/use-cases/get-project-by-id.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';

// Presentation
import { ProjectController } from './presentation/project.controller';

// Common
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { PermissionGuard } from '../../common/guards/permission.guard';

// PermissionGuard depends on IRoleRepository — import RoleModule which exports it
import { RoleModule } from '../role/role.module';

const USE_CASES = [
  CreateProjectUseCase,
  GetAllProjectsUseCase,
  GetProjectByIdUseCase,
  DeleteProjectUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOrmEntity]), RoleModule],
  controllers: [ProjectController],
  providers: [
    // Bind abstract port → concrete implementation (DIP)
    {
      provide: IProjectRepository,
      useClass: ProjectRepository,
    },
    Reflector,
    ResponseInterceptor,
    PermissionGuard,
    ...USE_CASES,
  ],
  exports: [...USE_CASES],
})
export class ProjectModule {}
