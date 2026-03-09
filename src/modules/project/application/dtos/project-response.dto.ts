import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { OtherCostType } from '../../domain/value-objects/other-cost.vo';
import { FeeType } from '../../domain/enums/fee-type.enum';
import { PaymentType } from '../../domain/enums/payment-type.enum';
import { ProjectPriority } from '../../domain/enums/project-priority.enum';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { Project } from '../../domain/entities/project.entity';

export class ProjectItemResponseDto {
  @ApiProperty()
  namaItem: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  satuan: string;

  @ApiProperty()
  hargaSatuan: number;

  @ApiProperty()
  subtotal: number;
}

export class OtherCostResponseDto {
  @ApiProperty()
  tipe: OtherCostType;

  @ApiPropertyOptional()
  keterangan: string | null;

  @ApiProperty()
  nominal: number;
}

export class ExternalMarketerResponseDto {
  @ApiProperty()
  namaMarketer: string;

  @ApiProperty()
  kontak: string;

  @ApiProperty({ enum: FeeType })
  tipeFee: FeeType;

  @ApiPropertyOptional()
  feePersentase: number | null;

  @ApiPropertyOptional()
  feeNominal: number | null;

  @ApiProperty()
  totalNilai: number;

  @ApiPropertyOptional()
  catatan: string | null;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'PRJ-001' })
  nomorProyek: string;

  // ── Basic Info ──────────────────────────────────────────────────────────
  @ApiProperty()
  judulProyek: string;

  @ApiProperty()
  kategori: string;

  @ApiProperty()
  deskripsi: string;

  // ── Client ──────────────────────────────────────────────────────────────
  @ApiProperty()
  namaClient: string;

  @ApiProperty()
  kontak: string;

  @ApiProperty()
  instansi: string;

  // ── Config ───────────────────────────────────────────────────────────────
  @ApiProperty({ enum: ProjectPriority })
  prioritas: ProjectPriority;

  @ApiProperty()
  assignedToUserId: string;

  @ApiProperty()
  deadline: Date;

  @ApiProperty({ enum: PaymentType })
  tipePembayaran: PaymentType;

  // ── Items ────────────────────────────────────────────────────────────────
  @ApiProperty({ type: [ProjectItemResponseDto] })
  items: ProjectItemResponseDto[];

  @ApiProperty()
  totalNilai: number;

  // ── Optional ─────────────────────────────────────────────────────────────
  @ApiPropertyOptional()
  nomorPO: string | null;

  @ApiPropertyOptional()
  catatan: string | null;

  @ApiPropertyOptional()
  ppnPersen: number | null;

  @ApiPropertyOptional()
  ppnNominal: number | null;

  @ApiPropertyOptional()
  pphPersen: number | null;

  @ApiPropertyOptional()
  pphNominal: number | null;

  @ApiProperty({ type: [OtherCostResponseDto] })
  biayaLainnya: OtherCostResponseDto[];

  @ApiPropertyOptional({ type: ExternalMarketerResponseDto })
  marketingExternal: ExternalMarketerResponseDto | null;

  // ── Meta ─────────────────────────────────────────────────────────────────
  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(project: Project): ProjectResponseDto {
    const dto = new ProjectResponseDto();

    dto.id = project.id;
    dto.nomorProyek = project.nomorProyek;
    dto.judulProyek = project.judulProyek;
    dto.kategori = project.kategori;
    dto.deskripsi = project.deskripsi;
    dto.namaClient = project.namaClient;
    dto.kontak = project.kontak;
    dto.instansi = project.instansi;
    dto.prioritas = project.prioritas;
    dto.assignedToUserId = project.assignedToUserId;
    dto.deadline = project.deadline;
    dto.tipePembayaran = project.tipePembayaran;
    dto.items = project.items.map((item) => ({
      namaItem: item.namaItem,
      quantity: item.quantity,
      satuan: item.satuan,
      hargaSatuan: item.hargaSatuan,
      subtotal: item.subtotal,
    }));
    dto.totalNilai = project.totalNilai;
    dto.nomorPO = project.nomorPO;
    dto.catatan = project.catatan;
    dto.ppnPersen = project.ppnPersen;
    dto.ppnNominal = project.ppnNominal;
    dto.pphPersen = project.pphPersen;
    dto.pphNominal = project.pphNominal;
    dto.biayaLainnya = project.biayaLainnya.map((bc) => ({
      tipe: bc.tipe,
      keterangan: bc.keterangan,
      nominal: bc.nominal,
    }));
    dto.marketingExternal = project.marketingExternal
      ? {
          namaMarketer: project.marketingExternal.namaMarketer,
          kontak: project.marketingExternal.kontak,
          tipeFee: project.marketingExternal.tipeFee,
          feePersentase: project.marketingExternal.feePersentase,
          feeNominal: project.marketingExternal.feeNominal,
          totalNilai: project.marketingExternal.totalNilai,
          catatan: project.marketingExternal.catatan,
        }
      : null;
    dto.status = project.status;
    dto.createdByUserId = project.createdByUserId;
    dto.createdAt = project.createdAt;
    dto.updatedAt = project.updatedAt;

    return dto;
  }
}
