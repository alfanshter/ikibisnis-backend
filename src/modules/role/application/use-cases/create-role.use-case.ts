import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Role } from '../../domain/entities/role.entity';
import { FeaturePermission } from '../../domain/value-objects/feature-permission.vo';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(dto: CreateRoleDto): Promise<RoleResponseDto> {
    const nameExists = await this.roleRepository.existsByName(dto.name);
    if (nameExists) {
      throw new ConflictException(`Role dengan nama "${dto.name}" sudah ada.`);
    }

    const permissions = dto.permissions.map(
      (p) => new FeaturePermission(p.feature, p.actions),
    );

    const now = new Date();
    const role = new Role({
      id: randomUUID(),
      name: dto.name.trim(),
      description: dto.description.trim(),
      badgeColor: dto.badgeColor,
      isActive: true,
      permissions,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.roleRepository.save(role);
    return RoleResponseDto.fromDomain(saved);
  }
}
