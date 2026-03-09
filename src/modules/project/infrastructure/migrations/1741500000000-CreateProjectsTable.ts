import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the `projects` table.
 *
 * JSONB columns:
 *  - items            → array of line-items (barang/jasa)
 *  - biaya_lainnya    → array of other costs
 *  - marketing_external → single object (nullable)
 */
export class CreateProjectsTable1741500000000 implements MigrationInterface {
  name = 'CreateProjectsTable1741500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id"                    UUID          NOT NULL,
        "judul_proyek"          VARCHAR(255)  NOT NULL,
        "kategori"              VARCHAR(100)  NOT NULL,
        "deskripsi"             TEXT          NOT NULL,
        "nama_client"           VARCHAR(255)  NOT NULL,
        "kontak"                VARCHAR(100)  NOT NULL,
        "instansi"              VARCHAR(255)  NOT NULL,
        "prioritas"             VARCHAR(20)   NOT NULL,
        "assigned_to_user_id"   UUID          NOT NULL,
        "deadline"              DATE          NOT NULL,
        "tipe_pembayaran"       VARCHAR(20)   NOT NULL,
        "items"                 JSONB         NOT NULL DEFAULT '[]',
        "total_nilai"           NUMERIC(18,2) NOT NULL DEFAULT 0,
        "nomor_po"              VARCHAR(100)  NULL,
        "catatan"               TEXT          NULL,
        "ppn_persen"            NUMERIC(5,2)  NULL,
        "ppn_nominal"           NUMERIC(18,2) NULL,
        "pph_persen"            NUMERIC(5,2)  NULL,
        "pph_nominal"           NUMERIC(18,2) NULL,
        "biaya_lainnya"         JSONB         NOT NULL DEFAULT '[]',
        "marketing_external"    JSONB         NULL,
        "status"                VARCHAR(20)   NOT NULL DEFAULT 'baru',
        "created_by_user_id"    UUID          NOT NULL,
        "created_at"            TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"            TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects" PRIMARY KEY ("id")
      )
    `);

    // Index: filter by status
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_status"
      ON "projects" ("status")
    `);

    // Index: filter by assigned user
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_assigned_to_user_id"
      ON "projects" ("assigned_to_user_id")
    `);

    // Index: filter by created_by
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_created_by_user_id"
      ON "projects" ("created_by_user_id")
    `);

    // Index: sort by deadline
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_deadline"
      ON "projects" ("deadline" ASC)
    `);

    // Index: latest-first pagination
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_created_at"
      ON "projects" ("created_at" DESC)
    `);

    // GIN index on items JSONB for future containment queries
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_items_gin"
      ON "projects" USING gin("items")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_items_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_deadline"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_projects_created_by_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_projects_assigned_to_user_id"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
  }
}
