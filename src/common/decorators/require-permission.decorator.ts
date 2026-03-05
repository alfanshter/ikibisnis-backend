import { SetMetadata } from '@nestjs/common';
import { FeatureAction } from '../../modules/role/domain/enums/feature-action.enum';
import { SystemFeature } from '../../modules/role/domain/enums/system-feature.enum';

export const PERMISSION_KEY = 'required_permission';

export interface RequiredPermission {
  feature: SystemFeature;
  action: FeatureAction;
}

/**
 * Decorator to declare the required feature + action for an endpoint.
 * Used together with JwtAuthGuard + PermissionGuard.
 *
 * @example
 * @RequirePermission(SystemFeature.USER_MANAGEMENT_ROLES, FeatureAction.WRITE)
 */
export const RequirePermission = (
  feature: SystemFeature,
  action: FeatureAction,
): MethodDecorator =>
  SetMetadata<string, RequiredPermission>(PERMISSION_KEY, { feature, action });
