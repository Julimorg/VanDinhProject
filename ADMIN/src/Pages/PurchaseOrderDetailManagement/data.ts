// Mock data tĩnh — đúng shape của GetPurchaseOrderDetailRes
// Khi tích hợp API: xoá file này, dùng data từ useQuery

export const MOCK_PURCHASE_ORDER_DETAIL = {
  purchaseOrderId: "PO-0001",
  poCode: "PO-2025-0001",
  supplierName: "Công ty TNHH ABC",
  note: "Đơn hàng ưu tiên cao, giao trước 17h thứ 6. Liên hệ anh Minh SĐT 0901234567 trước khi giao.",
  createdBy: "nguyen.van.a",
  status: "PENDING",
  totalPrice: 24750000,
  totalQuantity: 47,
  orderDate: "2025-05-10T08:30:00",
  receivedDate: "",
  createAt: "2025-05-08T14:22:00",
  updateAt: "2025-05-09T09:10:00",
  items: [
    {
      productId: "PROD-001",
      productName: "Sơn nội thất cao cấp",
      productCode: "SNT-CAO-001",
      productVolume: "5L",
      colorName: "Trắng ngà",
      supplierName: "Công ty TNHH ABC",
      quantityOrdered: 12,
      costPrice: 480000,
      expiryDate: "2027-05-01T00:00:00",
      note: "Kiểm tra tem nhãn trước khi nhập",
      createAt: "2025-05-08T14:22:00",
      updateAt: "2025-05-08T14:22:00",
    },
    {
      productId: "PROD-002",
      productName: "Sơn ngoại thất chống thấm",
      productCode: "SNT-CT-002",
      productVolume: "18L",
      colorName: "Xám xi măng",
      supplierName: "Công ty TNHH ABC",
      quantityOrdered: 8,
      costPrice: 1250000,
      expiryDate: "2027-03-15T00:00:00",
      note: "",
      createAt: "2025-05-08T14:22:00",
      updateAt: "2025-05-08T14:22:00",
    },
    {
      productId: "PROD-003",
      productName: "Sơn lót chống kiềm",
      productCode: "SL-CK-003",
      productVolume: "5L",
      colorName: "Trắng",
      supplierName: "Công ty TNHH ABC",
      quantityOrdered: 15,
      costPrice: 320000,
      expiryDate: "2026-12-01T00:00:00",
      note: "Bảo quản nơi khô ráo",
      createAt: "2025-05-08T14:22:00",
      updateAt: "2025-05-08T14:22:00",
    },
    {
      productId: "PROD-004",
      productName: "Sơn epoxy sàn nhà",
      productCode: "SE-SN-004",
      productVolume: "4L",
      colorName: "Xanh dương",
      supplierName: "Công ty TNHH ABC",
      quantityOrdered: 6,
      costPrice: 890000,
      expiryDate: "2026-08-20T00:00:00",
      note: "",
      createAt: "2025-05-08T14:22:00",
      updateAt: "2025-05-08T14:22:00",
    },
    {
      productId: "PROD-005",
      productName: "Bột trét tường nội thất",
      productCode: "BT-NT-005",
      productVolume: "20kg",
      colorName: "Trắng",
      supplierName: "Công ty TNHH ABC",
      quantityOrdered: 6,
      costPrice: 185000,
      expiryDate: "2026-06-30T00:00:00",
      note: "",
      createAt: "2025-05-08T14:22:00",
      updateAt: "2025-05-08T14:22:00",
    },
  ],
};

// ── Format helpers ─────────────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}