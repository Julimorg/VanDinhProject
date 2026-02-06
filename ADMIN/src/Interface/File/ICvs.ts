
export interface ICsvImportRequest {
  file: File;
}

export interface ICsvImportResponse {
  status_code: number;
  message: string;
  data: {
    total_imported: number;
    products: IProduct[];
    file_name: string;
  };
  timestamp: string;
}

export interface ICsvValidateRequest {
  file: File;
}

export interface ICsvValidateResponse {
  status_code: number;
  message: string;
  data: {
    is_valid: boolean;
    total_rows: number;
    errors: string[];
    warnings?: string[];
    error_count: number;
  };
  timestamp: string;
}

export interface ICsvTemplateResponse {
  status_code: number;
  message: string;
  data: {
    file_name: string;
    file_content_base64: string;
    file_size: number;
    mime_type: string;
  };
  timestamp: string;
}

export interface ICsvExportResponse {
  status_code: number;
  message: string;
  data: {
    file_name: string;
    file_content_base64: string;
    total_records: number;
    file_size: number;
    mime_type: string;
  };
  timestamp: string;
}

export interface ICsvExportByCategoryRequest {
  categoryId: string;
}

export interface ICsvExportBySupplierRequest {
  supplierId: string;
}

export interface IRecentImportsResponse {
  status_code: number;
  message: string;
  data: IImportHistory[];
  timestamp: string;
}

export interface IImportHistory {
  id: string;
  fileName: string;
  date: string;
  records: number;
  status: 'success' | 'warning' | 'error';
  errors: number;
}

export interface IProduct {
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number;
  productPrice: number;
  supplier?: {
    supplierId: string;
    supplierName: string;
  };
  color?: {
    colorId: string;
    colorName: string;
  };
  category?: {
    categoryId: string;
    categoryName: string;
  };
  createAt?: string;
  updateAt?: string;
}