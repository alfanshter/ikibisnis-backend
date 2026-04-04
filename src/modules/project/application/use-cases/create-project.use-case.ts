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

    // Map items — jika sudahTermasukPajak = true, hitung DPP, PPN, PPh per item
    const sudahTermasukPajak = dto.sudahTermasukPajak ?? false;
    const ppnPersenItem = dto.ppnPersenItem ?? null;
    const pphPersenItem = dto.pphPersenItem ?? null;

    const items = dto.items.map((i) => {
      let dpp: number | null = null;
      let ppnNominalItem: number | null = null;
      let pphNominalItem: number | null = null;

      if (sudahTermasukPajak && ppnPersenItem != null) {
        // hargaSatuan sudah include PPN: DPP = harga / (1 + ppn/100)
        dpp =
          Math.round((i.hargaSatuan / (1 + ppnPersenItem / 100)) * 100) / 100;
        ppnNominalItem = Math.round(dpp * (ppnPersenItem / 100) * 100) / 100;
        if (pphPersenItem != null) {
          pphNominalItem = Math.round(dpp * (pphPersenItem / 100) * 100) / 100;
        }
      }

      return new ProjectItem({
        namaItem: i.namaItem,
        quantity: i.quantity,
        satuan: i.satuan,
        hargaSatuan: i.hargaSatuan,
        dpp,
        ppnNominalItem,
        pphNominalItem,
      });
    });

    // Compute total nilai from items
    const totalNilai = items.reduce(
      (sum, item) => sum + item.quantity * item.hargaSatuan,
      0,
    );

    // Jika sudahTermasukPajak, hitung ppnNominal & pphNominal total (sum semua items)
    // dan isi ppnPersen/pphPersen dari rate yang dipakai
    let derivedPpnPersen: number | null = dto.ppnPersen ?? null;
    let derivedPpnNominal: number | null = dto.ppnNominal ?? null;
    let derivedPphPersen: number | null = dto.pphPersen ?? null;
    let derivedPphNominal: number | null = dto.pphNominal ?? null;

    if (sudahTermasukPajak && ppnPersenItem != null) {
      derivedPpnPersen = ppnPersenItem;
      derivedPpnNominal =
        Math.round(
          items.reduce((sum, item) => sum + (item.subtotalPpn ?? 0), 0) * 100,
        ) / 100;

      if (pphPersenItem != null) {
        derivedPphPersen = pphPersenItem;
        derivedPphNominal =
          Math.round(
            items.reduce((sum, item) => sum + (item.subtotalPph ?? 0), 0) * 100,
          ) / 100;
      }
    }

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
      ppnPersen: derivedPpnPersen,
      ppnNominal: derivedPpnNominal,
      pphPersen: derivedPphPersen,
      pphNominal: derivedPphNominal,
      sudahTermasukPajak,
      ppnPersenItem,
      pphPersenItem,
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
