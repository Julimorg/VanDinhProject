import { FilterParams, PurchaseOrderStatus } from "@/Types/inventory/purchaseOrderTypes";


export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const SKELETON_COUNT = 8;

export const DEFAULT_PARAMS: FilterParams = {
  search: "",
  status: undefined,
  orderDateFrom: undefined,
  orderDateTo: undefined,
  page: 1,
  pageSize: 10,
};
export const STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  [PurchaseOrderStatus.DRAFTED]:     { label: "Nháp",      dot: "#FBBF24", bg: "#FEF3C7", text: "#92400E" },
  [PurchaseOrderStatus.RECEIVED]:  { label: "Đã nhận",   dot: "#10B981", bg: "#D1FAE5", text: "#065F46" },
};