import { Injectable, NotFoundException } from '@nestjs/common';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';
import { FeaturePermission } from '../../domain/value-objects/feature-permission.vo';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found.`);
    }

    if (dto.name && dto.name !== role.name) {
      const nameExists = await this.roleRepository.existsByName(dto.name, id);
      if (nameExists) {
        throw new ConflictException(
          `A role with the name "${dto.name}" already exists.`,
        );
      }
      role.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      role.description = dto.description.trim();
    }

    if (dto.badgeColor !== undefined) {
      role.badgeColor = dto.badgeColor;
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        role.activate();
      } else {
        role.deactivate();
      }
    }

    if (dto.permissions !== undefined) {
      role.permissions = dto.permissions.map(
        (p) => new FeaturePermission(p.feature, p.actions),
      );
    }

    role.updatedAt = new Date();
    const updated = await this.roleRepository.update(role);
    return RoleResponseDto.fromDomain(updated);
  }
}
