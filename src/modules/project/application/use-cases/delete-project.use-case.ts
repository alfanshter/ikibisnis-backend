import { Injectable, NotFoundException } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Proyek dengan ID "${id}" tidak ditemukan`);
    }

    await this.projectRepository.hardDelete(id);

    return { message: `Proyek "${project.judulProyek}" berhasil dihapus` };
  }
}
