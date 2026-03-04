import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User({
      id: orm.id,
      fullName: orm.fullName,
      email: orm.email,
      passwordHash: orm.passwordHash,
      phone: orm.phone,
      address: orm.address,
      gender: orm.gender,
      roleId: orm.roleId,
      roleName: orm.role?.name ?? null,
      birthPlace: orm.birthPlace,
      birthDate: orm.birthDate,
      nik: orm.nik,
      npwp: orm.npwp,
      isActive: orm.isActive,
      lastLoginAt: orm.lastLoginAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.fullName = domain.fullName;
    orm.email = domain.email;
    orm.passwordHash = domain.passwordHash;
    orm.phone = domain.phone;
    orm.address = domain.address;
    orm.gender = domain.gender;
    orm.roleId = domain.roleId;
    orm.birthPlace = domain.birthPlace;
    orm.birthDate = domain.birthDate;
    orm.nik = domain.nik;
    orm.npwp = domain.npwp;
    orm.isActive = domain.isActive;
    orm.lastLoginAt = domain.lastLoginAt;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
