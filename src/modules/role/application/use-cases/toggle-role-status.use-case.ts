import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { RoleResponseDto } from '../dtos/role-response.dto';

@Injectable()
export class ToggleRoleStatusUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found.`);
    }
    if (role.isActive) {
      role.deactivate();
    } else {
      role.activate();
    }
    const updated = await this.roleRepository.update(role);
    return RoleResponseDto.fromDomain(updated);
  }
}
