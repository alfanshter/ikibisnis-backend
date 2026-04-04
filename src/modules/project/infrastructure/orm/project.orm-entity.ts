import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { OtherCostType } from '../../domain/value-objects/other-cost.vo';
import { FeeType } from '../../domain/enums/fee-type.enum';
import { PaymentType } from '../../domain/enums/payment-type.enum';
import { ProjectPriority } from '../../domain/enums/project-priority.enum';
import { ProjectStatus } from '../../domain/enums/project-status.enum';

/** Shape stored in the JSONB `items` column */
export interface ProjectItemRecord {
  namaItem: string;
  quantity: number;
  satuan: string;
  hargaSatuan: number;
  dpp: number | null;
  ppnNominalItem: number | null;
  pphNominalItem: number | null;
}

/** Shape stored in the JSONB `biaya_lainnya` column */
export interface OtherCostRecord {
  tipe: OtherCostType;
  keterangan: string | null;
  nominal: number;
}

/** Shape stored in the JSONB `marketing_external` column */
export interface ExternalMarketerRecord {
  namaMarketer: string;
  kontak: string;
  tipeFee: FeeType;
  feePersentase: number | null;
  feeNominal: number | null;
  totalNilai: number;
  catatan: string | null;
}

/**
 * TypeORM entity — lives only in the infrastructure layer.
 * Domain entity (Project) is mapped to/from this via the repository.
 */
@Entity({ name: 'projects' })
export class ProjectOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  // ── Nomor Proyek (PRJ-001 format) ─────────────────────────────────────────
  @Column({ name: 'nomor_proyek', type: 'varchar', length: 20, unique: true })
  nomorProyek: string;

  // ── Basic Info ────────────────────────────────────────────────────────────
  @Column({ name: 'judul_proyek', type: 'varchar', length: 255 })
  judulProyek: string;

  @Column({ type: 'varchar', length: 100 })
  kategori: string;

  @Column({ type: 'text' })
  deskripsi: string;

  // ── Client Info ───────────────────────────────────────────────────────────
  @Column({ name: 'nama_client', type: 'varchar', length: 255 })
  namaClient: string;

  @Column({ type: 'varchar', length: 100 })
  kontak: string;

  @Column({ type: 'varchar', length: 255 })
  instansi: string;

  // ── Project Config ────────────────────────────────────────────────────────
  @Column({ type: 'varchar', length: 20 })
  prioritas: ProjectPriority;

  @Column({ name: 'assigned_to_user_id', type: 'uuid' })
  assignedToUserId: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ name: 'tipe_pembayaran', type: 'varchar', length: 20 })
  tipePembayaran: PaymentType;

  // ── Items (JSONB) ─────────────────────────────────────────────────────────
  @Column({ type: 'jsonb', default: [] })
  items: ProjectItemRecord[];

  @Column({ name: 'total_nilai', type: 'numeric', precision: 18, scale: 2 })
  totalNilai: number;

  // ── Optional ─────────────────────────────────────────────────────────────
  @Column({ name: 'nomor_po', type: 'varchar', length: 100, nullable: true })
  nomorPO: string | null;

  @Column({ type: 'text', nullable: true })
  catatan: string | null;

  // ── Tax ───────────────────────────────────────────────────────────────────
  @Column({
    name: 'ppn_persen',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  ppnPersen: number | null;

  @Column({
    name: 'ppn_nominal',
    type: 'numeric',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  ppnNominal: number | null;

  @Column({
    name: 'pph_persen',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  pphPersen: number | null;

  @Column({
    name: 'pph_nominal',
    type: 'numeric',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  pphNominal: number | null;

  // ── Pajak Termasuk dalam Harga Item ───────────────────────────────────────
  @Column({ name: 'sudah_termasuk_pajak', type: 'boolean', default: false })
  sudahTermasukPajak: boolean;

  @Column({
    name: 'ppn_persen_item',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  ppnPersenItem: number | null;

  @Column({
    name: 'pph_persen_item',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  pphPersenItem: number | null;

  // ── Other Costs (JSONB) ───────────────────────────────────────────────────
  @Column({ name: 'biaya_lainnya', type: 'jsonb', default: [] })
  biayaLainnya: OtherCostRecord[];

  // ── External Marketer (JSONB) ─────────────────────────────────────────────
  @Column({
    name: 'marketing_external',
    type: 'jsonb',
    nullable: true,
  })
  marketingExternal: ExternalMarketerRecord | null;

  // ── Status ────────────────────────────────────────────────────────────────
  @Column({ type: 'varchar', length: 20, default: ProjectStatus.BARU })
  status: ProjectStatus;

  // ── Audit ─────────────────────────────────────────────────────────────────
  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
