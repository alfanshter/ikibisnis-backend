import { FeeType } from '../enums/fee-type.enum';

/**
 * Marketing external details attached to a project.
 */
export class ExternalMarketer {
  namaMarketer: string;
  kontak: string;
  tipeFee: FeeType;
  /** Filled when tipeFee === FeeType.PERSENTASE */
  feePersentase: number | null;
  /** Filled when tipeFee === FeeType.NOMINAL */
  feeNominal: number | null;
  /** Computed / stored total value paid to the marketer */
  totalNilai: number;
  catatan: string | null;

  constructor(props: {
    namaMarketer: string;
    kontak: string;
    tipeFee: FeeType;
    feePersentase?: number | null;
    feeNominal?: number | null;
    totalNilai: number;
    catatan?: string | null;
  }) {
    this.namaMarketer = props.namaMarketer;
    this.kontak = props.kontak;
    this.tipeFee = props.tipeFee;
    this.feePersentase = props.feePersentase ?? null;
    this.feeNominal = props.feeNominal ?? null;
    this.totalNilai = props.totalNilai;
    this.catatan = props.catatan ?? null;
  }
}
