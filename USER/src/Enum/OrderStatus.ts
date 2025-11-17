export type OrderStatus = "Pending" | "Approved" | "Canceled";

export const STATUS_MAP: Record<OrderStatus, string> = {
  Pending: 'Đang chờ duyệt',
  Approved: 'Đã duyệt hoàn tất',
  Canceled: 'Đã được hủy'
};
