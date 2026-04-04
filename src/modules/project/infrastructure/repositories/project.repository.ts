import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IProjectRepository,
  ProjectFindAllQuery,
  ProjectFindAllResult,
  ProjectStatusSummary,
} from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectItem } from '../../domain/value-objects/project-item.vo';
import { OtherCost } from '../../domain/value-objects/other-cost.vo';
import { ExternalMarketer } from '../../domain/value-objects/external-marketer.vo';
import { ProjectOrmEntity } from '../orm/project.orm-entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly repo: Repository<ProjectOrmEntity>,
  ) {}

  async save(project: Project): Promise<Project> {
    const orm = this.toOrm(project);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Project | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(query: ProjectFindAllQuery): Promise<ProjectFindAllResult> {
    const { page, limit, search, status, kategori, tipePembayaran, prioritas } =
      query;

    const qb = this.repo
      .createQueryBuilder('p')
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(p.judulProyek ILIKE :search OR p.namaClient ILIKE :search OR p.instansi ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) {
      qb.andWhere('p.status = :status', { status });
    }
    if (kategori) {
      qb.andWhere('p.kategori ILIKE :kategori', { kategori: `%${kategori}%` });
    }
    if (tipePembayaran) {
      qb.andWhere('p.tipePembayaran = :tipePembayaran', { tipePembayaran });
    }
    if (prioritas) {
      qb.andWhere('p.prioritas = :prioritas', { prioritas });
    }

    const [rows, total] = await qb.getManyAndCount();
    return { data: rows.map((r) => this.toDomain(r)), total };
  }

  async countByStatus(): Promise<ProjectStatusSummary> {
    const rows: { status: ProjectStatus; count: string }[] = await this.repo
      .createQueryBuilder('p')
      .select('p.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('p.status')
      .getRawMany<{ status: ProjectStatus; count: string }>();

    const result = {} as ProjectStatusSummary;
    for (const row of rows) {
      result[row.status] = parseInt(row.count, 10);
    }
    // ensure all statuses are present (default 0)
    for (const s of Object.values(ProjectStatus)) {
      if (result[s] === undefined) result[s] = 0;
    }
    return result;
  }

  async nextNomorProyek(): Promise<string> {
    const raw: { val: string }[] = await this.repo.query(
      `SELECT nextval('projects_nomor_seq') AS val`,
    );
    const seq = parseInt(raw[0].val, 10);
    return `PRJ-${String(seq).padStart(3, '0')}`;
  }

  // ── Mapping helpers ───────────────────────────────────────────────────────

  private toOrm(project: Project): ProjectOrmEntity {
    const orm = new ProjectOrmEntity();
    orm.id = project.id;
    orm.nomorProyek = project.nomorProyek;
    orm.judulProyek = project.judulProyek;
    orm.kategori = project.kategori;
    orm.deskripsi = project.deskripsi;
    orm.namaClient = project.namaClient;
    orm.kontak = project.kontak;
    orm.instansi = project.instansi;
    orm.prioritas = project.prioritas;
    orm.assignedToUserId = project.assignedToUserId;
    orm.deadline = project.deadline;
    orm.tipePembayaran = project.tipePembayaran;
    orm.items = project.items.map((i) => ({
      namaItem: i.namaItem,
      quantity: i.quantity,
      satuan: i.satuan,
      hargaSatuan: i.hargaSatuan,
      dpp: i.dpp,
      ppnNominalItem: i.ppnNominalItem,
      pphNominalItem: i.pphNominalItem,
    }));
    orm.totalNilai = project.totalNilai;
    orm.nomorPO = project.nomorPO;
    orm.catatan = project.catatan;
    orm.ppnPersen = project.ppnPersen;
    orm.ppnNominal = project.ppnNominal;
    orm.pphPersen = project.pphPersen;
    orm.pphNominal = project.pphNominal;
    orm.sudahTermasukPajak = project.sudahTermasukPajak;
    orm.ppnPersenItem = project.ppnPersenItem;
    orm.pphPersenItem = project.pphPersenItem;
    orm.biayaLainnya = project.biayaLainnya.map((b) => ({
      tipe: b.tipe,
      keterangan: b.keterangan,
      nominal: b.nominal,
    }));
    orm.marketingExternal = project.marketingExternal
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
    orm.status = project.status;
    orm.createdByUserId = project.createdByUserId;
    orm.createdAt = project.createdAt;
    orm.updatedAt = project.updatedAt;
    return orm;
  }

  private toDomain(orm: ProjectOrmEntity): Project {
    const items = orm.items.map(
      (i) =>
        new ProjectItem({
          namaItem: i.namaItem,
          quantity: i.quantity,
          satuan: i.satuan,
          hargaSatuan: i.hargaSatuan,
          dpp: i.dpp ?? null,
          ppnNominalItem: i.ppnNominalItem ?? null,
          pphNominalItem: i.pphNominalItem ?? null,
        }),
    );

    const biayaLainnya = orm.biayaLainnya.map(
      (b) =>
        new OtherCost({
          tipe: b.tipe,
          keterangan: b.keterangan,
          nominal: b.nominal,
        }),
    );

    let marketingExternal: ExternalMarketer | null = null;
    if (orm.marketingExternal) {
      const m = orm.marketingExternal;
      marketingExternal = new ExternalMarketer({
        namaMarketer: m.namaMarketer,
        kontak: m.kontak,
        tipeFee: m.tipeFee,
        feePersentase: m.feePersentase,
        feeNominal: m.feeNominal,
        totalNilai: m.totalNilai,
        catatan: m.catatan,
      });
    }

    return new Project({
      id: orm.id,
      nomorProyek: orm.nomorProyek,
      judulProyek: orm.judulProyek,
      kategori: orm.kategori,
      deskripsi: orm.deskripsi,
      namaClient: orm.namaClient,
      kontak: orm.kontak,
      instansi: orm.instansi,
      prioritas: orm.prioritas,
      assignedToUserId: orm.assignedToUserId,
      deadline: orm.deadline,
      tipePembayaran: orm.tipePembayaran,
      items,
      totalNilai: Number(orm.totalNilai),
      nomorPO: orm.nomorPO,
      catatan: orm.catatan,
      ppnPersen: orm.ppnPersen !== null ? Number(orm.ppnPersen) : null,
      ppnNominal: orm.ppnNominal !== null ? Number(orm.ppnNominal) : null,
      pphPersen: orm.pphPersen !== null ? Number(orm.pphPersen) : null,
      pphNominal: orm.pphNominal !== null ? Number(orm.pphNominal) : null,
      sudahTermasukPajak: orm.sudahTermasukPajak ?? false,
      ppnPersenItem:
        orm.ppnPersenItem !== null ? Number(orm.ppnPersenItem) : null,
      pphPersenItem:
        orm.pphPersenItem !== null ? Number(orm.pphPersenItem) : null,
      biayaLainnya,
      marketingExternal,
      status: orm.status,
      createdByUserId: orm.createdByUserId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
