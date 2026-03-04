import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeatureAction } from '../../domain/enums/feature-action.enum';
import { SystemFeature } from '../../domain/enums/system-feature.enum';

/**
 * Stored inside roles.permissions as a JSONB array for maximum read performance.
 * Schema: [{ feature: "finance_report", actions: ["read","write"] }, ...]
 */
export interface PermissionRecord {
  feature: SystemFeature;
  actions: FeatureAction[];
}

/**
 * TypeORM entity — lives only in the infrastructure layer.
 * The domain entity (Role) is mapped to/from this via the repository.
 */
@Entity({ name: 'roles' })
export class RoleOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'badge_color', type: 'varchar', length: 20 })
  badgeColor: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /**
   * JSONB for blazing-fast reads; GIN index created in the migration
   * enables fast containment queries later (e.g. "roles that have finance_report read").
   */
  @Column({ type: 'jsonb', default: [] })
  permissions: PermissionRecord[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
