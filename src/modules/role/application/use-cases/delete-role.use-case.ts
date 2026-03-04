import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';

@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found.`);
    }
    await this.roleRepository.hardDelete(id);
    return { message: `Role "${role.name}" has been deleted successfully.` };
  }
}
