import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from '../../../role/infrastructure/orm/role.orm-entity';
import { Gender } from '../../domain/enums/gender.enum';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  @Index('IDX_users_email')
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  // ── Role FK ──────────────────────────────────────────────────────────────────
  @Column({ name: 'role_id', type: 'uuid' })
  @Index('IDX_users_role_id')
  roleId: string;

  @ManyToOne(() => RoleOrmEntity, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  // ── Optional fields ──────────────────────────────────────────────────────────
  @Column({ name: 'birth_place', type: 'varchar', length: 100, nullable: true })
  birthPlace: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'varchar', length: 16, nullable: true, unique: true })
  nik: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true, unique: true })
  npwp: string | null;

  // ── Status ───────────────────────────────────────────────────────────────────
  @Column({ name: 'is_active', type: 'boolean', default: true })
  @Index('IDX_users_is_active')
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
