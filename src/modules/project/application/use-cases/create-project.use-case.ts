import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectItem } from '../../domain/value-objects/project-item.vo';
import { OtherCost } from '../../domain/value-objects/other-cost.vo';
import { ExternalMarketer } from '../../domain/value-objects/external-marketer.vo';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { ProjectResponseDto } from '../dtos/project-response.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    dto: CreateProjectDto,
    createdByUserId: string,
  ): Promise<ProjectResponseDto> {
    const now = new Date();

    // Map items
    const items = dto.items.map(
      (i) =>
        new ProjectItem({
          namaItem: i.namaItem,
          quantity: i.quantity,
          satuan: i.satuan,
          hargaSatuan: i.hargaSatuan,
        }),
    );

    // Compute total nilai from items
    const totalNilai = items.reduce(
      (sum, item) => sum + item.quantity * item.hargaSatuan,
      0,
    );

    // Map biaya lainnya
    const biayaLainnya = (dto.biayaLainnya ?? []).map(
      (b) =>
        new OtherCost({
          tipe: b.tipe,
          keterangan: b.keterangan ?? null,
          nominal: b.nominal,
        }),
    );

    // Map external marketer
    let marketingExternal: ExternalMarketer | null = null;
    if (dto.marketingExternal) {
      const m = dto.marketingExternal;
      marketingExternal = new ExternalMarketer({
        namaMarketer: m.namaMarketer,
        kontak: m.kontak,
        tipeFee: m.tipeFee,
        feePersentase: m.feePersentase ?? null,
        feeNominal: m.feeNominal ?? null,
        totalNilai: m.totalNilai,
        catatan: m.catatan ?? null,
      });
    }

    const project = new Project({
      id: randomUUID(),
      nomorProyek: await this.projectRepository.nextNomorProyek(),
      judulProyek: dto.judulProyek.trim(),
      kategori: dto.kategori.trim(),
      deskripsi: dto.deskripsi.trim(),
      namaClient: dto.namaClient.trim(),
      kontak: dto.kontak.trim(),
      instansi: dto.instansi.trim(),
      prioritas: dto.prioritas,
      assignedToUserId: dto.assignedToUserId,
      deadline: new Date(dto.deadline),
      tipePembayaran: dto.tipePembayaran,
      items,
      totalNilai,
      nomorPO: dto.nomorPO?.trim() ?? null,
      catatan: dto.catatan?.trim() ?? null,
      ppnPersen: dto.ppnPersen ?? null,
      ppnNominal: dto.ppnNominal ?? null,
      pphPersen: dto.pphPersen ?? null,
      pphNominal: dto.pphNominal ?? null,
      biayaLainnya,
      marketingExternal,
      status: ProjectStatus.BARU,
      createdByUserId,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.projectRepository.save(project);
    return ProjectResponseDto.fromDomain(saved);
  }
}
