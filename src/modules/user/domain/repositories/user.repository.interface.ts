import { User } from '../entities/user.entity';

export interface UserFilterOptions {
  isActive?: boolean;
  roleId?: string;
  gender?: string;
  search?: string; // searches fullName or email
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Port (DIP) — domain depends only on this abstract contract.
 * The infrastructure layer provides the concrete implementation.
 */
export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(options?: UserFilterOptions): Promise<PaginatedUsers>;
  abstract save(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract hardDelete(id: string): Promise<void>;
  abstract existsByEmail(email: string, excludeId?: string): Promise<boolean>;
  abstract existsByNik(nik: string, excludeId?: string): Promise<boolean>;
  abstract existsByNpwp(npwp: string, excludeId?: string): Promise<boolean>;
}
