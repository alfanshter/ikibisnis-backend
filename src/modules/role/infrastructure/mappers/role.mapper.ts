import { Role } from '../../domain/entities/role.entity';
import { FeaturePermission } from '../../domain/value-objects/feature-permission.vo';
import { RoleOrmEntity } from '../orm/role.orm-entity';

/**
 * Pure mapper — translates between the ORM entity (infrastructure) and the
 * domain entity (domain). Keeps both layers fully decoupled.
 */
export class RoleMapper {
  static toDomain(orm: RoleOrmEntity): Role {
    const permissions = (orm.permissions ?? []).map(
      (p) => new FeaturePermission(p.feature, p.actions),
    );

    return new Role({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      badgeColor: orm.badgeColor,
      isActive: orm.isActive,
      permissions,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(domain: Role): RoleOrmEntity {
    const orm = new RoleOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.badgeColor = domain.badgeColor;
    orm.isActive = domain.isActive;
    const permRecords = domain.permissions.map((p) => p.toPlainObject());
    orm.permissions = permRecords as RoleOrmEntity['permissions'];
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
