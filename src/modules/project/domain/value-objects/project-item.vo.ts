/**
 * Represents a single line-item (barang/jasa) within a project.
 * Pure value object — no framework dependency.
 *
 * Jika proyek bertanda sudahTermasukPajak = true, use-case menghitung
 * dpp/ppnNominalItem/pphNominalItem sebelum membuat instance ini.
 */
export class ProjectItem {
  namaItem: string;
  quantity: number;
  satuan: string;
  hargaSatuan: number;

  /**
   * DPP (Dasar Pengenaan Pajak) per satuan = harga sebelum pajak.
   * Null jika item tidak dikenai pajak.
   */
  dpp: number | null;

  /** Nominal PPN per satuan (Rp). Null jika tidak ada pajak. */
  ppnNominalItem: number | null;

  /** Nominal PPh per satuan (Rp). Null jika tidak ada pajak. */
  pphNominalItem: number | null;

  constructor(props: {
    namaItem: string;
    quantity: number;
    satuan: string;
    hargaSatuan: number;
    dpp?: number | null;
    ppnNominalItem?: number | null;
    pphNominalItem?: number | null;
  }) {
    this.namaItem = props.namaItem;
    this.quantity = props.quantity;
    this.satuan = props.satuan;
    this.hargaSatuan = props.hargaSatuan;
    this.dpp = props.dpp ?? null;
    this.ppnNominalItem = props.ppnNominalItem ?? null;
    this.pphNominalItem = props.pphNominalItem ?? null;
  }

  /** Sub-total untuk line item ini (quantity × hargaSatuan) */
  get subtotal(): number {
    return this.quantity * this.hargaSatuan;
  }

  /** Total DPP untuk line item ini (quantity × dpp) */
  get subtotalDpp(): number | null {
    if (this.dpp == null) return null;
    return Math.round(this.quantity * this.dpp * 100) / 100;
  }

  /** Total PPN untuk line item ini (quantity × ppnNominalItem) */
  get subtotalPpn(): number | null {
    if (this.ppnNominalItem == null) return null;
    return Math.round(this.quantity * this.ppnNominalItem * 100) / 100;
  }

  /** Total PPh untuk line item ini (quantity × pphNominalItem) */
  get subtotalPph(): number | null {
    if (this.pphNominalItem == null) return null;
    return Math.round(this.quantity * this.pphNominalItem * 100) / 100;
  }
}
