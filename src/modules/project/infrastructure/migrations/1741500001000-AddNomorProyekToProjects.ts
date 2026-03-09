import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `nomor_proyek` (e.g. PRJ-001) to the projects table.
 *
 * Strategy:
 *  1. Add a PostgreSQL SEQUENCE `projects_nomor_seq`.
 *  2. Add `nomor_proyek` column with a DEFAULT that formats the next seq value.
 *  3. Back-fill existing rows (if any).
 *  4. Apply UNIQUE + NOT NULL constraints and an index.
 */
export class AddNomorProyekToProjects1741500001000 implements MigrationInterface {
  name = 'AddNomorProyekToProjects1741500001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create a sequence
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS "projects_nomor_seq"
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1
    `);

    // 2. Add the column (nullable first so back-fill can happen)
    await queryRunner.query(`
      ALTER TABLE "projects"
        ADD COLUMN IF NOT EXISTS "nomor_proyek" VARCHAR(20) NULL
    `);

    // 3. Back-fill existing rows with sequential numbers
    await queryRunner.query(`
      WITH numbered AS (
        SELECT id,
               'PRJ-' || LPAD(nextval('projects_nomor_seq')::text, 3, '0') AS num
        FROM "projects"
        ORDER BY "created_at" ASC
      )
      UPDATE "projects" p
        SET "nomor_proyek" = n.num
        FROM numbered n
        WHERE p.id = n.id
    `);

    // 4. Set NOT NULL + UNIQUE
    await queryRunner.query(`
      ALTER TABLE "projects"
        ALTER COLUMN "nomor_proyek" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "projects"
        ADD CONSTRAINT "UQ_projects_nomor_proyek" UNIQUE ("nomor_proyek")
    `);

    // 5. Index for fast lookup
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_nomor_proyek"
        ON "projects" ("nomor_proyek")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_nomor_proyek"`);
    await queryRunner.query(`
      ALTER TABLE "projects"
        DROP CONSTRAINT IF EXISTS "UQ_projects_nomor_proyek"
    `);
    await queryRunner.query(`
      ALTER TABLE "projects"
        DROP COLUMN IF EXISTS "nomor_proyek"
    `);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "projects_nomor_seq"`);
  }
}
