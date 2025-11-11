export interface Color {
  colorId: string;
  colorName: string;
  colorCode: string;
  colorDescription: string;
  colorImg: string;
  supplierName: string;
  createAt: string;
  updateAt: string;
}

export const mockColors: Color[] = [
  {
    colorId: "CLR001",
    colorName: "Đỏ Thẫm",
    colorCode: "#8B0000",
    colorDescription: "Màu đỏ thẫm sang trọng, phù hợp cho các sản phẩm cao cấp",
    colorImg: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop",
    supplierName: "Công ty TNHH Sơn Cao Cấp",
    createAt: "2024-01-15T08:30:00",
    updateAt: "2024-11-01T14:20:00"
  },
  {
    colorId: "CLR002",
    colorName: "Xanh Dương",
    colorCode: "#1E90FF",
    colorDescription: "Màu xanh dương tươi sáng, tạo cảm giác mát mẻ",
    colorImg: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop",
    supplierName: "Nhà phân phối Minh Phát",
    createAt: "2024-02-20T10:15:00",
    updateAt: "2024-10-28T16:45:00"
  },
  {
    colorId: "CLR003",
    colorName: "Xanh Lá",
    colorCode: "#228B22",
    colorDescription: "Màu xanh lá tự nhiên, thân thiện với môi trường",
    colorImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    supplierName: "Tập đoàn Thương mại Hòa Bình",
    createAt: "2024-03-10T09:00:00",
    updateAt: "2024-11-05T11:30:00"
  },
  {
    colorId: "CLR004",
    colorName: "Vàng Cam",
    colorCode: "#FFA500",
    colorDescription: "Màu vàng cam ấm áp, tạo năng lượng tích cực",
    colorImg: "https://images.unsplash.com/photo-1611596538832-1d54e794a63a?w=400&h=300&fit=crop",
    supplierName: "Công ty Cổ phần Xuất nhập khẩu",
    createAt: "2024-04-05T13:45:00",
    updateAt: "2024-11-08T09:15:00"
  },
  {
    colorId: "CLR005",
    colorName: "Tím Lavender",
    colorCode: "#9370DB",
    colorDescription: "Màu tím lavender nhẹ nhàng, thanh lịch",
    colorImg: "https://images.unsplash.com/photo-1557672199-6ba25d83c5d5?w=400&h=300&fit=crop",
    supplierName: "Nhà cung cấp Phương Nam",
    createAt: "2024-05-12T15:20:00",
    updateAt: "2024-11-10T10:00:00"
  },
  {
    colorId: "CLR006",
    colorName: "Hồng Nhạt",
    colorCode: "#FFB6C1",
    colorDescription: "Màu hồng nhạt dịu dàng, nữ tính",
    colorImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    supplierName: "Công ty TNHH Sơn Cao Cấp",
    createAt: "2024-06-18T11:00:00",
    updateAt: "2024-11-09T08:30:00"
  }
];

export const mockSuppliers: string[] = [
  "Công ty TNHH Sơn Cao Cấp",
  "Nhà phân phối Minh Phát",
  "Tập đoàn Thương mại Hòa Bình",
  "Công ty Cổ phần Xuất nhập khẩu",
  "Nhà cung cấp Phương Nam"
];