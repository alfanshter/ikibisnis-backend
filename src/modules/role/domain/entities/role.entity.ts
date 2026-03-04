import { FeaturePermission } from '../value-objects/feature-permission.vo';

/**
 * Core domain entity for Role.
 * Contains pure business logic; no framework dependencies.
 */
export class Role {
  readonly id: string;
  name: string;
  description: string;
  badgeColor: string; // HEX color e.g. "#FF5733"
  isActive: boolean;
  permissions: FeaturePermission[];
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    description: string;
    badgeColor: string;
    isActive: boolean;
    permissions: FeaturePermission[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.badgeColor = props.badgeColor;
    this.isActive = props.isActive;
    this.permissions = props.permissions;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** Activate / deactivate a role */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
