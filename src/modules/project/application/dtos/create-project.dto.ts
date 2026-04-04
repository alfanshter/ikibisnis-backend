import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeeType } from '../../domain/enums/fee-type.enum';
import { PaymentType } from '../../domain/enums/payment-type.enum';
import { ProjectPriority } from '../../domain/enums/project-priority.enum';
import type { OtherCostType } from '../../domain/value-objects/other-cost.vo';

// ─── Nested DTOs ─────────────────────────────────────────────────────────────

export class ProjectItemDto {
  @ApiProperty({ example: 'Laptop Dell XPS', description: 'Nama item/barang' })
  @IsNotEmpty()
  @IsString()
  namaItem: string;

  @ApiProperty({ example: 2, description: 'Jumlah / quantity' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 'unit',
    description: 'Satuan (unit, pcs, buah, dll)',
  })
  @IsNotEmpty()
  @IsString()
  satuan: string;

  @ApiProperty({ example: 15000000, description: 'Harga satuan (Rp)' })
  @IsNumber()
  @Min(0)
  hargaSatuan: number;
}

export class OtherCostDto {
  @ApiProperty({
    example: 'e_materai',
    description:
      'Tipe biaya: e_materai | materai | e_sign | biaya_admin | lainnya',
  })
  @IsString()
  @IsNotEmpty()
  tipe: OtherCostType;

  @ApiPropertyOptional({
    example: 'SIPLAH 1%',
    description: 'Keterangan (wajib diisi jika tipe === lainnya)',
  })
  @IsOptional()
  @IsString()
  keterangan?: string | null;

  @ApiProperty({ example: 10000, description: 'Nominal biaya (Rp)' })
  @IsNumber()
  @Min(0)
  nominal: number;
}

export class ExternalMarketerDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama marketer' })
  @IsNotEmpty()
  @IsString()
  namaMarketer: string;

  @ApiProperty({ example: '08123456789', description: 'Kontak marketer' })
  @IsNotEmpty()
  @IsString()
  kontak: string;

  @ApiProperty({
    enum: FeeType,
    example: FeeType.PERSENTASE,
    description: 'Tipe fee: persentase | nominal',
  })
  @IsEnum(FeeType)
  tipeFee: FeeType;

  @ApiPropertyOptional({
    example: 5,
    description: 'Fee dalam persentase (isi jika tipeFee = persentase)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  feePersentase?: number | null;

  @ApiPropertyOptional({
    example: 500000,
    description: 'Fee dalam nominal Rp (isi jika tipeFee = nominal)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  feeNominal?: number | null;

  @ApiProperty({
    example: 1500000,
    description: 'Total nilai fee marketer (Rp)',
  })
  @IsNumber()
  @Min(0)
  totalNilai: number;

  @ApiPropertyOptional({ example: 'Referral dari pameran' })
  @IsOptional()
  @IsString()
  catatan?: string | null;
}

// ─── Main DTO ────────────────────────────────────────────────────────────────

export class CreateProjectDto {
  // ── Basic Info ──────────────────────────────────────────────────────────
  @ApiProperty({
    example: 'Website E-Commerce PT. Maju',
    description: 'Judul proyek',
  })
  @IsNotEmpty()
  @IsString()
  judulProyek: string;

  @ApiProperty({ example: 'Software', description: 'Kategori proyek' })
  @IsNotEmpty()
  @IsString()
  kategori: string;

  @ApiProperty({
    example: 'Pengembangan website e-commerce untuk PT. Maju Jaya',
  })
  @IsNotEmpty()
  @IsString()
  deskripsi: string;

  // ── Client Info ─────────────────────────────────────────────────────────
  @ApiProperty({ example: 'PT. Maju Jaya', description: 'Nama client' })
  @IsNotEmpty()
  @IsString()
  namaClient: string;

  @ApiProperty({ example: '08219876543', description: 'Kontak client' })
  @IsNotEmpty()
  @IsString()
  kontak: string;

  @ApiProperty({
    example: 'PT. Maju Jaya',
    description: 'Nama instansi / perusahaan',
  })
  @IsNotEmpty()
  @IsString()
  instansi: string;

  // ── Project Config ───────────────────────────────────────────────────────
  @ApiProperty({
    enum: ProjectPriority,
    example: ProjectPriority.SEDANG,
    description: 'Prioritas: rendah | sedang | tinggi',
  })
  @IsEnum(ProjectPriority)
  prioritas: ProjectPriority;

  @ApiProperty({
    format: 'uuid',
    example: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
    description: 'ID user yang ditugaskan (FK → users)',
  })
  @IsUUID('4')
  assignedToUserId: string;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Deadline proyek (ISO date)',
  })
  @IsDateString()
  deadline: string;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.REGULER,
    description: 'Tipe pembayaran: reguler | termin | sewa',
  })
  @IsEnum(PaymentType)
  tipePembayaran: PaymentType;

  // ── Line Items ───────────────────────────────────────────────────────────
  @ApiProperty({
    type: [ProjectItemDto],
    description: 'Daftar item barang/jasa',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  items: ProjectItemDto[];

  // ── Optional ─────────────────────────────────────────────────────────────
  @ApiPropertyOptional({
    example: 'PO-2026-001',
    description: 'Nomor Purchase Order',
  })
  @IsOptional()
  @IsString()
  nomorPO?: string | null;

  @ApiPropertyOptional({ example: 'Proyek harus selesai sebelum lebaran' })
  @IsOptional()
  @IsString()
  catatan?: string | null;

  @ApiPropertyOptional({ example: 11, description: 'PPN dalam persen (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ppnPersen?: number | null;

  @ApiPropertyOptional({
    example: 3300000,
    description: 'PPN dalam nominal (Rp)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ppnNominal?: number | null;

  @ApiPropertyOptional({ example: 2, description: 'PPh dalam persen (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pphPersen?: number | null;

  @ApiPropertyOptional({
    example: 600000,
    description: 'PPh dalam nominal (Rp)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pphNominal?: number | null;

  // ── Pajak Termasuk dalam Item ─────────────────────────────────────────────
  @ApiPropertyOptional({
    example: true,
    description:
      'Apakah semua harga item sudah termasuk PPN & PPh? ' +
      'Jika true, sistem menghitung DPP, nominal PPN, dan nominal PPh untuk SETIAP item ' +
      'menggunakan ppnPersenItem dan pphPersenItem.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sudahTermasukPajak?: boolean;

  @ApiPropertyOptional({
    example: 11,
    description:
      'Rate PPN (%) yang digunakan untuk menghitung breakdown pajak semua item — ' +
      'wajib diisi jika sudahTermasukPajak = true',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ppnPersenItem?: number | null;

  @ApiPropertyOptional({
    example: 2,
    description:
      'Rate PPh (%) yang digunakan untuk menghitung breakdown pajak semua item — ' +
      'opsional, diisi jika ada PPh',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pphPersenItem?: number | null;

  @ApiPropertyOptional({
    type: [OtherCostDto],
    description: 'Biaya lainnya (e-materai, materai, e-sign, biaya admin, dll)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherCostDto)
  biayaLainnya?: OtherCostDto[];

  @ApiPropertyOptional({
    type: ExternalMarketerDto,
    description: 'Data marketing external (opsional)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExternalMarketerDto)
  marketingExternal?: ExternalMarketerDto | null;
}
