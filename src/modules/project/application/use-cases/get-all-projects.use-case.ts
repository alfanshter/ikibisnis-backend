import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { ProjectQueryDto } from '../dtos/project-query.dto';
import {
  PaginatedProjectResponseDto,
  ProjectListItemDto,
  ProjectStatusSummaryDto,
} from '../dtos/project-list-response.dto';

@Injectable()
export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(query: ProjectQueryDto): Promise<PaginatedProjectResponseDto> {
    const [{ data, total }, statusCounts] = await Promise.all([
      this.projectRepository.findAll({
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: query.status,
        kategori: query.kategori,
        tipePembayaran: query.tipePembayaran,
        prioritas: query.prioritas,
      }),
      this.projectRepository.countByStatus(),
    ]);

    const response = new PaginatedProjectResponseDto();
    response.data = data.map((p) => ProjectListItemDto.fromDomain(p));
    response.total = total;
    response.page = query.page;
    response.limit = query.limit;
    response.totalPages = Math.ceil(total / query.limit);
    response.summary = ProjectStatusSummaryDto.fromRecord(statusCounts);

    return response;
  }
}
