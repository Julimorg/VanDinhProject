export interface Data {
  id: number;
  name: string;
  type: string;
  model: string;
  position: string;
  status: 'active' | 'inactive';
}

export const Data: Data[] = [
  { id: 1, name: 'KIOSK-01', type: 'Máy Kiosk', model: 'TouchSystems', position: 'Quầy vé Cổng A', status: 'active' },
  { id: 2, name: 'KIOSK-02', type: 'Máy Kiosk', model: 'TouchSystems', position: 'Quầy vé Cổng C', status: 'inactive' },
]