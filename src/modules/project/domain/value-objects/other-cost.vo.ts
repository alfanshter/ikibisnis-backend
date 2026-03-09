/**
 * Represents an additional cost line (biaya lainnya) on a project.
 *
 * Pre-defined types: e_materai | materai | e_sign | biaya_admin | lainnya
 * When type === 'lainnya', keterangan holds the free-text label entered by the user.
 */
export type OtherCostType =
  | 'e_materai'
  | 'materai'
  | 'e_sign'
  | 'biaya_admin'
  | 'lainnya';

export class OtherCost {
  tipe: OtherCostType;
  keterangan: string | null; // required when tipe === 'lainnya'
  nominal: number;

  constructor(props: {
    tipe: OtherCostType;
    keterangan?: string | null;
    nominal: number;
  }) {
    this.tipe = props.tipe;
    this.keterangan = props.keterangan ?? null;
    this.nominal = props.nominal;
  }
}
