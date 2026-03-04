import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserQueryDto } from '../dtos/user-query.dto';
import { PaginatedUserResponseDto, UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: UserQueryDto): Promise<PaginatedUserResponseDto> {
    const result = await this.userRepository.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      isActive: query.isActive,
      gender: query.gender,
      roleId: query.roleId,
    });

    return {
      data: result.data.map((u) => UserResponseDto.fromDomain(u)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
