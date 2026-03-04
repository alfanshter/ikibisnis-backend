import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `users` table.
 * - UUID PK
 * - FK role_id → roles(id) RESTRICT (cannot delete a role that has users)
 * - Unique constraints: email, nik, npwp
 * - B-tree indexes: email, role_id, is_active, created_at
 */
export class CreateUsersTable1709500000001 implements MigrationInterface {
  name = 'CreateUsersTable1709500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "users_gender_enum" AS ENUM ('male', 'female')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID          NOT NULL,
        "full_name"     VARCHAR(150)  NOT NULL,
        "email"         VARCHAR(150)  NOT NULL,
        "password_hash" TEXT          NOT NULL,
        "phone"         VARCHAR(20)   NOT NULL,
        "address"       TEXT          NOT NULL,
        "gender"        "users_gender_enum" NOT NULL,
        "role_id"       UUID          NOT NULL,
        "birth_place"   VARCHAR(100),
        "birth_date"    DATE,
        "nik"           VARCHAR(16),
        "npwp"          VARCHAR(15),
        "is_active"     BOOLEAN       NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMPTZ,
        "created_at"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users"       PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_nik"   UNIQUE ("nik"),
        CONSTRAINT "UQ_users_npwp"  UNIQUE ("npwp"),
        CONSTRAINT "FK_users_role"  FOREIGN KEY ("role_id")
          REFERENCES "roles"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_email"      ON "users" ("email")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_role_id"    ON "users" ("role_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_is_active"  ON "users" ("is_active")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_created_at" ON "users" ("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_gender_enum"`);
  }
}
