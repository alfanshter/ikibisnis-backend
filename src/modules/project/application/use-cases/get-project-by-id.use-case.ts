import { Injectable, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { ProjectResponseDto } from '../dtos/project-response.dto';

@Injectable()
export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Proyek dengan id "${id}" tidak ditemukan`);
    }
    return ProjectResponseDto.fromDomain(project);
  }
}
