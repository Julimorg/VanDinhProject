export interface Data {
  id: number;
  name: string;
  type: string;
  model: string;
  position: string;
  status: 'active' | 'inactive';
}

export const Data: Data[] = [
  { id: 1, name: 'PRINTER-B001', type: 'Máy in', model: 'Epson TM-T88VI', position: 'Quầy vé Cổng B', status: 'active' },
  { id: 2, name: 'PRINTER-B002', type: 'Máy in', model: 'Epson TM-T88VI', position: 'Quầy vé Cổng A', status: 'inactive' },
]