import { IGetPurchaseOrderResponse } from "@/Interface/Inventory/GetPurchaseOrder";

export type Order = IGetPurchaseOrderResponse;

export const PurchaseOrderStatus = {
  DRAFTED: "DRAFTED",
  RECEIVED: "RECEIVED",
} as const;

export type PurchaseOrderStatus = typeof PurchaseOrderStatus[keyof typeof PurchaseOrderStatus];

export type FilterParams = {
  search: string;
  status?: PurchaseOrderStatus;        
  orderDateFrom?: string;
  orderDateTo?: string;
  page: number;
  pageSize: number;
};