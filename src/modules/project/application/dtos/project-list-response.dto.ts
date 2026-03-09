import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { ProjectPriority } from '../../domain/enums/project-priority.enum';
import { PaymentType } from '../../domain/enums/payment-type.enum';
import { ProjectStatusSummary } from '../../domain/repositories/project.repository.interface';

// ── Deadline status helper ───────────────────────────────────────────────────

export type DeadlineStatus = 'lewat' | 'hari_ini' | 'minggu_ini' | 'normal';

function getDeadlineStatus(deadline: Date): DeadlineStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dl = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );
  const diffDays = Math.floor(
    (dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return 'lewat';
  if (diffDays === 0) return 'hari_ini';
  if (diffDays <= 7) return 'minggu_ini';
  return 'normal';
}

// ── ProjectListItemDto ───────────────────────────────────────────────────────

/**
 * Lightweight DTO used in the list / table view.
 * Contains only the fields needed to render a row in the UI.
 */
export class ProjectListItemDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  id: string;

  @ApiProperty({ example: 'PRJ-001' })
  nomorProyek: string;

  @ApiProperty({ example: 'Pengembangan Aplikasi Kasir' })
  judulProyek: string;

  @ApiProperty({ example: 'Aplikasi' })
  kategori: string;

  @ApiProperty({ example: 'Sistem kasir berbasis web untuk toko retail...' })
  deskripsiSingkat: string;

  @ApiProperty({ example: 'PT Maju Bersama' })
  namaClient: string;

  @ApiProperty({ example: 'CV Teknologi Nusantara' })
  instansi: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.BARU })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectPriority, example: ProjectPriority.TINGGI })
  prioritas: ProjectPriority;

  @ApiProperty({ enum: PaymentType, example: PaymentType.REGULER })
  tipePembayaran: PaymentType;

  @ApiProperty({ example: '2025-12-31' })
  deadline: string;

  @ApiProperty({
    enum: ['lewat', 'hari_ini', 'minggu_ini', 'normal'],
    example: 'normal',
    description: 'Derived from deadline vs today — used for badge colour in UI',
  })
  deadlineStatus: DeadlineStatus;

  @ApiPropertyOptional({
    example: 3,
    description: 'Days remaining (negative = overdue)',
  })
  sisaHari: number;

  @ApiProperty({ example: 15000000 })
  totalNilai: number;

  @ApiProperty({ example: '2025-01-15T08:00:00.000Z' })
  createdAt: string;

  // ── Static factory ─────────────────────────────────────────────────────────

  static fromDomain(project: Project): ProjectListItemDto {
    const dto = new ProjectListItemDto();
    dto.id = project.id;
    dto.nomorProyek = project.nomorProyek;
    dto.judulProyek = project.judulProyek;
    dto.kategori = project.kategori;

    // Truncate deskripsi to ~120 chars for table display
    const raw = project.deskripsi ?? '';
    dto.deskripsiSingkat = raw.length > 120 ? raw.slice(0, 117) + '...' : raw;

    dto.namaClient = project.namaClient;
    dto.instansi = project.instansi;
    dto.status = project.status;
    dto.prioritas = project.prioritas;
    dto.tipePembayaran = project.tipePembayaran;

    const dl = new Date(project.deadline);
    dto.deadline = dl.toISOString().split('T')[0]; // YYYY-MM-DD

    dto.deadlineStatus = getDeadlineStatus(dl);

    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const dlMidnight = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate());
    dto.sisaHari = Math.floor(
      (dlMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
    );

    dto.totalNilai = project.totalNilai;
    dto.createdAt = project.createdAt.toISOString();
    return dto;
  }
}

// ── Status summary ───────────────────────────────────────────────────────────

export class ProjectStatusSummaryDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 10 })
  baru: number;

  @ApiProperty({ example: 8 })
  proses: number;

  @ApiProperty({ example: 3 })
  pending: number;

  @ApiProperty({ example: 12 })
  selesai: number;

  @ApiProperty({ example: 7 })
  dibayar: number;

  @ApiProperty({ example: 2 })
  dibatalkan: number;

  static fromRecord(counts: ProjectStatusSummary): ProjectStatusSummaryDto {
    const dto = new ProjectStatusSummaryDto();
    dto.baru = counts[ProjectStatus.BARU] ?? 0;
    dto.proses = counts[ProjectStatus.PROSES] ?? 0;
    dto.pending = counts[ProjectStatus.PENDING] ?? 0;
    dto.selesai = counts[ProjectStatus.SELESAI] ?? 0;
    dto.dibayar = counts[ProjectStatus.DIBAYAR] ?? 0;
    dto.dibatalkan = counts[ProjectStatus.DIBATALKAN] ?? 0;
    dto.total =
      dto.baru +
      dto.proses +
      dto.pending +
      dto.selesai +
      dto.dibayar +
      dto.dibatalkan;
    return dto;
  }
}

// ── PaginatedProjectResponseDto ──────────────────────────────────────────────

export class PaginatedProjectResponseDto {
  @ApiProperty({ type: [ProjectListItemDto] })
  data: ProjectListItemDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ type: ProjectStatusSummaryDto })
  summary: ProjectStatusSummaryDto;
}
