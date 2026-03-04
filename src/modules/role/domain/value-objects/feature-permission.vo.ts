import { FeatureAction } from '../enums/feature-action.enum';
import { SystemFeature } from '../enums/system-feature.enum';

/**
 * Domain value object that represents a single feature permission entry.
 * Immutable once created; to change permissions, create a new instance.
 */
export class FeaturePermission {
  readonly feature: SystemFeature;
  readonly actions: ReadonlySet<FeatureAction>;

  constructor(feature: SystemFeature, actions: FeatureAction[]) {
    if (!actions || actions.length === 0) {
      throw new Error(
        `FeaturePermission for "${feature}" must have at least one action.`,
      );
    }
    this.feature = feature;
    this.actions = new Set(actions);
  }

  hasAction(action: FeatureAction): boolean {
    return this.actions.has(action);
  }

  toPlainObject(): { feature: string; actions: string[] } {
    return {
      feature: this.feature,
      actions: Array.from(this.actions),
    };
  }
}
