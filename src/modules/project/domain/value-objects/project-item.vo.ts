/**
 * Represents a single line-item (barang/jasa) within a project.
 * Pure value object — no framework dependency.
 */
export class ProjectItem {
  namaItem: string;
  quantity: number;
  satuan: string;
  hargaSatuan: number;

  constructor(props: {
    namaItem: string;
    quantity: number;
    satuan: string;
    hargaSatuan: number;
  }) {
    this.namaItem = props.namaItem;
    this.quantity = props.quantity;
    this.satuan = props.satuan;
    this.hargaSatuan = props.hargaSatuan;
  }

  /** Sub-total for this line item */
  get subtotal(): number {
    return this.quantity * this.hargaSatuan;
  }
}
