import { Role } from '../entities/role.entity';

export interface RoleFilterOptions {
  isActive?: boolean;
  search?: string; // searches name or description
  page?: number;
  limit?: number;
}

export interface PaginatedRoles {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Port / repository interface (Dependency Inversion Principle).
 * The domain never depends on TypeORM — only on this contract.
 */
export abstract class IRoleRepository {
  abstract findById(id: string): Promise<Role | null>;
  abstract findByName(name: string): Promise<Role | null>;
  abstract findAll(options?: RoleFilterOptions): Promise<PaginatedRoles>;
  abstract save(role: Role): Promise<Role>;
  abstract update(role: Role): Promise<Role>;
  abstract hardDelete(id: string): Promise<void>;
  abstract existsByName(name: string, excludeId?: string): Promise<boolean>;
}
