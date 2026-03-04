import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';

// Domain
import { IUserRepository } from './domain/repositories/user.repository.interface';

// Infrastructure
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity';
import { UserRepository } from './infrastructure/repositories/user.repository';

// Application — Use Cases
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase, ChangePasswordUseCase } from './application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ToggleUserStatusUseCase } from './application/use-cases/toggle-user-status.use-case';

// Presentation
import { UserController } from './presentation/user.controller';

// Common
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

const USE_CASES = [
  CreateUserUseCase,
  UpdateUserUseCase,
  ChangePasswordUseCase,
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  DeleteUserUseCase,
  ToggleUserStatusUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    { provide: IUserRepository, useClass: UserRepository },
    Reflector,
    ResponseInterceptor,
    ...USE_CASES,
  ],
  exports: [IUserRepository],
})
export class UserModule {}
