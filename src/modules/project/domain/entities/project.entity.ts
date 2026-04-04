import { PaymentType } from '../enums/payment-type.enum';
import { ProjectPriority } from '../enums/project-priority.enum';
import { ProjectStatus } from '../enums/project-status.enum';
import { ExternalMarketer } from '../value-objects/external-marketer.vo';
import { OtherCost } from '../value-objects/other-cost.vo';
import { ProjectItem } from '../value-objects/project-item.vo';

/**
 * Core domain entity for Project.
 * Contains pure business logic; no framework dependencies.
 */
export class Project {
  readonly id: string;

  // ── Nomor Proyek (PRJ-001 format, auto-assigned) ──────────────────────────
  nomorProyek: string;

  // ── Basic Info ────────────────────────────────────────────────────────────
  judulProyek: string;
  kategori: string;
  deskripsi: string;

  // ── Client Info ───────────────────────────────────────────────────────────
  namaClient: string;
  kontak: string;
  instansi: string;

  // ── Project Config ────────────────────────────────────────────────────────
  prioritas: ProjectPriority;
  assignedToUserId: string; // FK → users.id
  deadline: Date;
  tipePembayaran: PaymentType;

  // ── Items (line-items / barang) ───────────────────────────────────────────
  items: ProjectItem[];
  totalNilai: number; // sum of item subtotals (before tax/other costs)

  // ── Optional Fields ───────────────────────────────────────────────────────
  nomorPO: string | null;
  catatan: string | null;

  // ── Tax / PPN ─────────────────────────────────────────────────────────────
  ppnPersen: number | null; // percentage  e.g. 11 (for 11%)
  ppnNominal: number | null; // flat nominal

  // ── PPh ───────────────────────────────────────────────────────────────────
  pphPersen: number | null;
  pphNominal: number | null;

  // ── Pajak Termasuk dalam Harga Item ──────────────────────────────────────
  /** Apakah semua harga item sudah include PPN & PPh */
  sudahTermasukPajak: boolean;
  /** Rate PPN (%) untuk breakdown pajak per item */
  ppnPersenItem: number | null;
  /** Rate PPh (%) untuk breakdown pajak per item */
  pphPersenItem: number | null;

  // ── Other Costs ───────────────────────────────────────────────────────────
  biayaLainnya: OtherCost[];

  // ── External Marketer ─────────────────────────────────────────────────────
  marketingExternal: ExternalMarketer | null;

  // ── Status ────────────────────────────────────────────────────────────────
  status: ProjectStatus;

  readonly createdAt: Date;
  updatedAt: Date;
  createdByUserId: string; // FK → users.id (the authenticated user who created it)

  constructor(props: {
    id: string;
    nomorProyek: string;
    judulProyek: string;
    kategori: string;
    deskripsi: string;
    namaClient: string;
    kontak: string;
    instansi: string;
    prioritas: ProjectPriority;
    assignedToUserId: string;
    deadline: Date;
    tipePembayaran: PaymentType;
    items: ProjectItem[];
    totalNilai: number;
    nomorPO?: string | null;
    catatan?: string | null;
    ppnPersen?: number | null;
    ppnNominal?: number | null;
    pphPersen?: number | null;
    pphNominal?: number | null;
    sudahTermasukPajak?: boolean;
    ppnPersenItem?: number | null;
    pphPersenItem?: number | null;
    biayaLainnya?: OtherCost[];
    marketingExternal?: ExternalMarketer | null;
    status?: ProjectStatus;
    createdByUserId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.nomorProyek = props.nomorProyek;
    this.judulProyek = props.judulProyek;
    this.kategori = props.kategori;
    this.deskripsi = props.deskripsi;
    this.namaClient = props.namaClient;
    this.kontak = props.kontak;
    this.instansi = props.instansi;
    this.prioritas = props.prioritas;
    this.assignedToUserId = props.assignedToUserId;
    this.deadline = props.deadline;
    this.tipePembayaran = props.tipePembayaran;
    this.items = props.items;
    this.totalNilai = props.totalNilai;
    this.nomorPO = props.nomorPO ?? null;
    this.catatan = props.catatan ?? null;
    this.ppnPersen = props.ppnPersen ?? null;
    this.ppnNominal = props.ppnNominal ?? null;
    this.pphPersen = props.pphPersen ?? null;
    this.pphNominal = props.pphNominal ?? null;
    this.sudahTermasukPajak = props.sudahTermasukPajak ?? false;
    this.ppnPersenItem = props.ppnPersenItem ?? null;
    this.pphPersenItem = props.pphPersenItem ?? null;
    this.biayaLainnya = props.biayaLainnya ?? [];
    this.marketingExternal = props.marketingExternal ?? null;
    this.status = props.status ?? ProjectStatus.BARU;
    this.createdByUserId = props.createdByUserId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** Recalculate totalNilai from items */
  recalculateTotalNilai(): void {
    this.totalNilai = this.items.reduce(
      (sum, item) => sum + item.quantity * item.hargaSatuan,
      0,
    );
    this.updatedAt = new Date();
  }
}
