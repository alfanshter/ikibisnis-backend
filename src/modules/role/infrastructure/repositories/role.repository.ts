import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';
import {
  IRoleRepository,
  PaginatedRoles,
  RoleFilterOptions,
} from '../../domain/repositories/role.repository.interface';
import { RoleOrmEntity } from '../orm/role.orm-entity';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repo: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? RoleMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const orm = await this.repo.findOne({ where: { name } });
    return orm ? RoleMapper.toDomain(orm) : null;
  }

  async findAll(options: RoleFilterOptions = {}): Promise<PaginatedRoles> {
    const { page = 1, limit = 10, isActive, search } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (isActive !== undefined) {
      where['isActive'] = isActive;
    }

    if (search) {
      // Search in name OR description using ILIKE (case-insensitive)
      const [data, total] = await this.repo.findAndCount({
        where: [
          { ...where, name: ILike(`%${search}%`) },
          { ...where, description: ILike(`%${search}%`) },
        ],
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      return {
        data: data.map((o) => RoleMapper.toDomain(o)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: data.map((o) => RoleMapper.toDomain(o)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async save(role: Role): Promise<Role> {
    const orm = RoleMapper.toOrm(role);
    const saved = await this.repo.save(orm);
    return RoleMapper.toDomain(saved);
  }

  async update(role: Role): Promise<Role> {
    const orm = RoleMapper.toOrm(role);
    const saved = await this.repo.save(orm);
    return RoleMapper.toDomain(saved);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('role')
      .where('role.name = :name', { name });

    if (excludeId) {
      qb.andWhere('role.id != :excludeId', { excludeId });
    }

    const count = await qb.getCount();
    return count > 0;
  }
}
