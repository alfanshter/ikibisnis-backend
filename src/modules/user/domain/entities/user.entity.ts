import { Gender } from '../enums/gender.enum';

/**
 * Core domain entity for User.
 * No framework dependencies — pure business logic.
 */
export class User {
  readonly id: string;
  fullName: string;
  email: string;
  passwordHash: string; // bcrypt hash — never store plaintext
  phone: string;
  address: string;
  gender: Gender;
  roleId: string; // FK → Role.id
  roleName: string | null; // denormalized — populated when relation is loaded

  // Optional fields
  birthPlace: string | null;
  birthDate: Date | null;
  nik: string | null; // Nomor Induk Kependudukan (16 digits)
  npwp: string | null; // Nomor Pokok Wajib Pajak (15 digits)

  isActive: boolean;
  lastLoginAt: Date | null;

  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    phone: string;
    address: string;
    gender: Gender;
    roleId: string;
    roleName?: string | null;
    birthPlace?: string | null;
    birthDate?: Date | null;
    nik?: string | null;
    npwp?: string | null;
    isActive?: boolean;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.phone = props.phone;
    this.address = props.address;
    this.gender = props.gender;
    this.roleId = props.roleId;
    this.roleName = props.roleName ?? null;
    this.birthPlace = props.birthPlace ?? null;
    this.birthDate = props.birthDate ?? null;
    this.nik = props.nik ?? null;
    this.npwp = props.npwp ?? null;
    this.isActive = props.isActive ?? true;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  recordLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }
}
