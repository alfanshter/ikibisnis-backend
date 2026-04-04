import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds three new columns to the `projects` table to support the
 * "harga item sudah termasuk pajak" feature:
 *
 *  - sudah_termasuk_pajak  BOOLEAN  DEFAULT false
 *  - ppn_persen_item       NUMERIC(5,2) NULL
 *  - pph_persen_item       NUMERIC(5,2) NULL
 *
 * The `items` JSONB column already stores per-item computed values
 * (dpp, ppnNominalItem, pphNominalItem) — no column change needed there.
 */
export class AddTaxIncludedFieldsToProjects1743750000000 implements MigrationInterface {
  name = 'AddTaxIncludedFieldsToProjects1743750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "projects"
        ADD COLUMN IF NOT EXISTS "sudah_termasuk_pajak" BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "ppn_persen_item"      NUMERIC(5,2)  NULL,
        ADD COLUMN IF NOT EXISTS "pph_persen_item"      NUMERIC(5,2)  NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "projects"
        DROP COLUMN IF EXISTS "sudah_termasuk_pajak",
        DROP COLUMN IF EXISTS "ppn_persen_item",
        DROP COLUMN IF EXISTS "pph_persen_item"
    `);
  }
}
