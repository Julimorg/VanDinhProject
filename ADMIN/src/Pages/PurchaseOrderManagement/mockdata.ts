import { GetPurchaseOrderRes, PurchaseOrderStatus } from "./purchaseOrder";


// ── Status display config ──────────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  [PurchaseOrderStatus.DRAFT]: {
    label: "Nháp",
    color: "#6B7280",
    bg: "#F3F4F6",
    dot: "#9CA3AF",
  },
  [PurchaseOrderStatus.PENDING]: {
    label: "Chờ duyệt",
    color: "#D97706",
    bg: "#FEF3C7",
    dot: "#F59E0B",
  },
  [PurchaseOrderStatus.APPROVED]: {
    label: "Đã duyệt",
    color: "#2563EB",
    bg: "#DBEAFE",
    dot: "#3B82F6",
  },
  [PurchaseOrderStatus.RECEIVED]: {
    label: "Đã nhận",
    color: "#059669",
    bg: "#D1FAE5",
    dot: "#10B981",
  },
  [PurchaseOrderStatus.CANCELLED]: {
    label: "Đã huỷ",
    color: "#DC2626",
    bg: "#FEE2E2",
    dot: "#EF4444",
  },
};

// ── Static mock data — đúng theo GetPurchaseOrderRes ──────────────────────
export const MOCK_PURCHASE_ORDERS: GetPurchaseOrderRes[] = [
  {
    purchaseOrderId: "PO-0001",
    poCode: "PO-2025-0001",
    supplierName: "Công ty TNHH ABC",
    note: "Đơn hàng ưu tiên cao, giao trước 17h thứ 6",
    createdBy: "nguyen.van.a",
    status: PurchaseOrderStatus.PENDING,
    orderDate: "2025-05-10T08:30:00",
    createAt: "2025-05-08T14:22:00",
  },
  {
    purchaseOrderId: "PO-0002",
    poCode: "PO-2025-0002",
    supplierName: "Thương mại XYZ",
    note: "",
    createdBy: "tran.thi.b",
    status: PurchaseOrderStatus.APPROVED,
    orderDate: "2025-05-12T09:00:00",
    createAt: "2025-05-09T10:15:00",
  },
  {
    purchaseOrderId: "PO-0003",
    poCode: "PO-2025-0003",
    supplierName: "Nhà phân phối 123",
    note: "Kiểm tra kỹ hạn sử dụng trước khi nhập kho",
    createdBy: "admin",
    status: PurchaseOrderStatus.RECEIVED,
    orderDate: "2025-04-28T07:45:00",
    createAt: "2025-04-25T09:30:00",
  },
  {
    purchaseOrderId: "PO-0004",
    poCode: "PO-2025-0004",
    supplierName: "Tập đoàn DEF",
    note: "",
    createdBy: "le.van.c",
    status: PurchaseOrderStatus.DRAFT,
    orderDate: "2025-05-20T10:00:00",
    createAt: "2025-05-18T16:00:00",
  },
  {
    purchaseOrderId: "PO-0005",
    poCode: "PO-2025-0005",
    supplierName: "Công ty GHI Sài Gòn",
    note: "Hàng dễ vỡ, cẩn thận khi vận chuyển",
    createdBy: "pham.thi.d",
    status: PurchaseOrderStatus.CANCELLED,
    orderDate: "2025-04-15T08:00:00",
    createAt: "2025-04-12T11:00:00",
  },
  {
    purchaseOrderId: "PO-0006",
    poCode: "PO-2025-0006",
    supplierName: "Công ty TNHH ABC",
    note: "",
    createdBy: "nguyen.van.a",
    status: PurchaseOrderStatus.APPROVED,
    orderDate: "2025-05-05T13:30:00",
    createAt: "2025-05-03T08:45:00",
  },
  {
    purchaseOrderId: "PO-0007",
    poCode: "PO-2025-0007",
    supplierName: "Thương mại XYZ",
    note: "Đặt thêm dự phòng 10% so với số lượng đơn",
    createdBy: "tran.thi.b",
    status: PurchaseOrderStatus.PENDING,
    orderDate: "2025-05-18T10:00:00",
    createAt: "2025-05-16T09:00:00",
  },
  {
    purchaseOrderId: "PO-0008",
    poCode: "PO-2025-0008",
    supplierName: "Nhà phân phối 123",
    note: "",
    createdBy: "admin",
    status: PurchaseOrderStatus.RECEIVED,
    orderDate: "2025-04-20T08:30:00",
    createAt: "2025-04-18T14:00:00",
  },
  {
    purchaseOrderId: "PO-0009",
    poCode: "PO-2025-0009",
    supplierName: "Tập đoàn DEF",
    note: "Yêu cầu hoá đơn VAT đỏ kèm theo",
    createdBy: "le.van.c",
    status: PurchaseOrderStatus.DRAFT,
    orderDate: "2025-05-22T09:15:00",
    createAt: "2025-05-21T10:30:00",
  },
  {
    purchaseOrderId: "PO-0010",
    poCode: "PO-2025-0010",
    supplierName: "Công ty GHI Sài Gòn",
    note: "",
    createdBy: "pham.thi.d",
    status: PurchaseOrderStatus.APPROVED,
    orderDate: "2025-05-01T11:00:00",
    createAt: "2025-04-29T14:00:00",
  },
  {
    purchaseOrderId: "PO-0011",
    poCode: "PO-2025-0011",
    supplierName: "Công ty TNHH ABC",
    note: "Liên hệ trước khi giao hàng",
    createdBy: "nguyen.van.a",
    status: PurchaseOrderStatus.PENDING,
    orderDate: "2025-05-25T08:00:00",
    createAt: "2025-05-23T09:00:00",
  },
  {
    purchaseOrderId: "PO-0012",
    poCode: "PO-2025-0012",
    supplierName: "Thương mại XYZ",
    note: "",
    createdBy: "tran.thi.b",
    status: PurchaseOrderStatus.CANCELLED,
    orderDate: "2025-03-10T10:00:00",
    createAt: "2025-03-08T08:30:00",
  },
];

// ── Format helpers ─────────────────────────────────────────────────────────
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}