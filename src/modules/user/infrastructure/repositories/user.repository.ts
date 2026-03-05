import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  PaginatedUsers,
  UserFilterOptions,
} from '../../domain/repositories/user.repository.interface';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOne({
      where: { id },
      relations: { role: true },
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({
      where: { email },
      relations: { role: true },
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll(options: UserFilterOptions = {}): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, isActive, search, gender, roleId } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where['isActive'] = isActive;
    if (gender !== undefined) where['gender'] = gender;
    if (roleId !== undefined) where['roleId'] = roleId;

    if (search) {
      const [data, total] = await this.repo.findAndCount({
        where: [
          { ...where, fullName: ILike(`%${search}%`) },
          { ...where, email: ILike(`%${search}%`) },
        ],
        relations: { role: true },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      return {
        data: data.map((o) => UserMapper.toDomain(o)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: { role: true },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: data.map((o) => UserMapper.toDomain(o)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async save(user: User): Promise<User> {
    const orm = UserMapper.toOrm(user);
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    const orm = UserMapper.toOrm(user);
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email });
    if (excludeId) {
      qb.andWhere('user.id != :excludeId', { excludeId });
    }
    return (await qb.getCount()) > 0;
  }

  async existsByNik(nik: string, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('user')
      .where('user.nik = :nik', { nik });
    if (excludeId) {
      qb.andWhere('user.id != :excludeId', { excludeId });
    }
    return (await qb.getCount()) > 0;
  }

  async existsByNpwp(npwp: string, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('user')
      .where('user.npwp = :npwp', { npwp });
    if (excludeId) {
      qb.andWhere('user.id != :excludeId', { excludeId });
    }
    return (await qb.getCount()) > 0;
  }
}
