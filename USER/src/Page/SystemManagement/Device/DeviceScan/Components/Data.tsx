export interface Data {
  id: number;
  name: string;
  type: string;
  model: string;
  position: string;
  status: 'active' | 'inactive';
}

export const Data: Data[] = [
  { id: 1, name: 'SCANNER-001', type: 'Máy quét', model: 'Honeywell', position: 'Quầy vé Cổng C', status: 'active' },
  { id: 2, name: 'SCANNER-001', type: 'Máy quét', model: 'Honeywell', position: 'Quầy vé Cổng A', status: 'inactive' },
]