import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial migration: creates the `roles` table with:
 *  - UUID primary key
 *  - JSONB permissions column
 *  - GIN index on permissions for fast containment queries
 *  - B-tree index on name (unique), is_active, created_at
 */
export class CreateRolesTable1709500000000 implements MigrationInterface {
  name = 'CreateRolesTable1709500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id"          UUID          NOT NULL,
        "name"        VARCHAR(100)  NOT NULL,
        "description" TEXT          NOT NULL,
        "badge_color" VARCHAR(20)   NOT NULL,
        "is_active"   BOOLEAN       NOT NULL DEFAULT true,
        "permissions" JSONB         NOT NULL DEFAULT '[]',
        "created_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name")
      )
    `);

    // GIN index: enables fast @> queries like
    //   WHERE permissions @> '[{"feature":"finance_report"}]'
    await queryRunner.query(`
      CREATE INDEX "IDX_roles_permissions_gin"
      ON "roles" USING gin("permissions")
    `);

    // Index for active status filter
    await queryRunner.query(`
      CREATE INDEX "IDX_roles_is_active"
      ON "roles" ("is_active")
    `);

    // Index for latest-first pagination
    await queryRunner.query(`
      CREATE INDEX "IDX_roles_created_at"
      ON "roles" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_permissions_gin"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
  }
}
