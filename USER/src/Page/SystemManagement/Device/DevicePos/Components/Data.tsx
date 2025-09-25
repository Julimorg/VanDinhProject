export interface Data {
  id: number;
  name: string;
  type: string;
  model: string;
  position: string;
  status: 'active' | 'inactive';
}

export const Data: Data[] = [
  { id: 1, name: 'POS-A001', type: 'Máy POS', model: 'HP ElitePOS G1', position: 'Quầy vé Cổng A', status: 'active' },
  { id: 2, name: 'POS-A002', type: 'Máy POS', model: 'HP ElitePOS G1', position: 'Quầy vé Cổng C', status: 'inactive' },
]