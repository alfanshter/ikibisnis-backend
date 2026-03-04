/**
 * Granular actions that can be assigned to a feature permission.
 * Each action can be independently toggled on a Role → Feature association.
 */
export enum FeatureAction {
  READ = 'read',
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete',
}
