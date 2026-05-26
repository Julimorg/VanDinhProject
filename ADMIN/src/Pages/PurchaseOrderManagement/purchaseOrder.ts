export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  RECEIVED = "RECEIVED",
  CANCELLED = "CANCELLED",
}

// Đúng theo GetPurchaseOrderRes từ backend
export interface GetPurchaseOrderRes {
  purchaseOrderId: string;
  poCode: string;
  supplierName: string;
  note: string;
  createdBy: string;
  status: PurchaseOrderStatus;
  orderDate: string; // LocalDateTime → ISO string
  createAt: string;  // LocalDateTime → ISO string
}

// Filter params dùng trong UI (bạn tự map sang query API)
export interface PurchaseOrderFilterParams {
  search: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  status: PurchaseOrderStatus | "";
  page: number;
  pageSize: number;
}