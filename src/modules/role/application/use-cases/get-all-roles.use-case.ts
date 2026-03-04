import { Injectable } from '@nestjs/common';
import {
  IRoleRepository,
  RoleFilterOptions,
} from '../../domain/repositories/role.repository.interface';
import {
  PaginatedRoleResponseDto,
  RoleResponseDto,
} from '../dtos/role-response.dto';
import { RoleQueryDto } from '../dtos/role-query.dto';

@Injectable()
export class GetAllRolesUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(query: RoleQueryDto): Promise<PaginatedRoleResponseDto> {
    const options: RoleFilterOptions = {
      search: query.search,
      isActive: query.isActive,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    };

    const result = await this.roleRepository.findAll(options);

    const dto = new PaginatedRoleResponseDto();
    dto.data = result.data.map((r) => RoleResponseDto.fromDomain(r));
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;
    dto.totalPages = result.totalPages;
    return dto;
  }
}
