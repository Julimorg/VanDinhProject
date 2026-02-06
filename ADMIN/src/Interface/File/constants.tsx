import { ImportRecord, Stats } from './types';

export const STATS: Stats = {
  totalProducts: 1245,
  lastImport: '2 giờ trước',
  successRate: 98.5,
  pendingImports: 3,
};

export const RECENT_IMPORTS: ImportRecord[] = [
  {
    id: 1,
    fileName: 'san_pham_2025_02_batch1.csv',
    date: '2026-02-03 14:30',
    records: 150,
    status: 'success',
    errors: 0,
  },
  {
    id: 2,
    fileName: 'san_pham_2025_02_batch2.csv',
    date: '2026-02-02 09:15',
    records: 320,
    status: 'success',
    errors: 1,
  },
  {
    id: 3,
    fileName: 'san_pham_2025_01_batch5.csv',
    date: '2026-01-28 17:45',
    records: 180,
    status: 'warning',
    errors: 4,
  },
];

export const HISTORY_TABLE_COLUMNS = [
  {
    title: 'Tên file',
    dataIndex: 'fileName',
    key: 'fileName',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-lg">📊</span>
        <span className="font-medium">{text}</span>
      </div>
    ),
  },
  {
    title: 'Ngày nhập',
    dataIndex: 'date',
    key: 'date',
    responsive: ['md'],
  },
  {
    title: 'Số dòng',
    dataIndex: 'records',
    key: 'records',
    align: 'center' as const,
    render: (num: number) => (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        {num}
      </span>
    ),
  },
  {
    title: 'Lỗi',
    dataIndex: 'errors',
    key: 'errors',
    align: 'center' as const,
    render: (err: number) => (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          err === 0
            ? 'bg-green-100 text-green-800'
            : err <= 3
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {err}
      </span>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    align: 'center' as const,
    render: (status: string) => {
      const map: Record<string, { label: string; color: string }> = {
        success: { label: 'Thành công', color: 'green' },
        warning: { label: 'Cảnh báo', color: 'gold' },
        error: { label: 'Thất bại', color: 'red' },
      };
      const config = map[status];
      return <span className={`text-${config.color}-600 font-medium`}>{config.label}</span>;
    },
  },
];