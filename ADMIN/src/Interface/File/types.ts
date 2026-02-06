
export interface ImportRecord {
  id: number;
  fileName: string;
  date: string;
  records: number;
  status: 'success' | 'warning' | 'error';
  errors: number;
}

export interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  errors: string[];
  warnings: string[];
}

export interface Stats {
  totalProducts: number;
  lastImport: string;
  successRate: number;
  pendingImports: number;
}