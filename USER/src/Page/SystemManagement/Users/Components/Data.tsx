export interface Data {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Receipter';
  status: 'active' | 'inactive';
}

export const Data: Data[] = [
  { id: 1, name: 'Admin', email: 'admin@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Receipter', email: 'receipter@example.com', role: 'Receipter', status: 'active' },
]