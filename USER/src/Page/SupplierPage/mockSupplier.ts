export interface Supplier {
  supplierId: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supplierImg: string;
  createAt: string;
  updateAt: string;
}

export const mockSuppliers: Supplier[] = [
  {
    supplierId: "SUP001",
    supplierName: "Công ty TNHH Thực phẩm An Khang",
    supplierAddress: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    supplierPhone: "028 3899 1234",
    supplierImg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
    createAt: "2024-01-15T08:30:00",
    updateAt: "2024-11-01T14:20:00"
  },
  {
    supplierId: "SUP002",
    supplierName: "Nhà phân phối Minh Phát",
    supplierAddress: "456 Đường Lê Văn Việt, Quận 9, TP.HCM",
    supplierPhone: "028 3876 5432",
    supplierImg: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=400&h=300&fit=crop",
    createAt: "2024-02-20T10:15:00",
    updateAt: "2024-10-28T16:45:00"
  },
  {
    supplierId: "SUP003",
    supplierName: "Tập đoàn Thương mại Hòa Bình",
    supplierAddress: "789 Đường Võ Văn Ngân, Thủ Đức, TP.HCM",
    supplierPhone: "028 3654 7890",
    supplierImg: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop",
    createAt: "2024-03-10T09:00:00",
    updateAt: "2024-11-05T11:30:00"
  },
  {
    supplierId: "SUP004",
    supplierName: "Công ty Cổ phần Xuất nhập khẩu Thành Đạt",
    supplierAddress: "321 Đường Phan Văn Trị, Gò Vấp, TP.HCM",
    supplierPhone: "028 3999 8888",
    supplierImg: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=400&h=300&fit=crop",
    createAt: "2024-04-05T13:45:00",
    updateAt: "2024-11-08T09:15:00"
  },
  {
    supplierId: "SUP005",
    supplierName: "Nhà cung cấp Phương Nam",
    supplierAddress: "555 Đường Trần Hưng Đạo, Quận 1, TP.HCM",
    supplierPhone: "028 3822 3456",
    supplierImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    createAt: "2024-05-12T15:20:00",
    updateAt: "2024-11-10T10:00:00"
  }
];