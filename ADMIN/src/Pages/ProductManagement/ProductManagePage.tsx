import React, { useState, useMemo } from 'react';
import { Table, Pagination, Input, Button, Space, Typography, Image, Tag, Carousel, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined, SortAscendingOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

// Interface cho Product dựa trên API response
interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string[]; // Mảng images
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number;
  productPrice: string;
  supplierName: string;
  colorName: string;
  categoryName: string | null;
  createAt: string;
  updateAt: string;
}

// Props cho component
interface ProductListProps {
  data: Product[]; // Mảng content từ API
  pagination: {
    size: number;
    number: number; // Trang hiện tại
    totalElements: number;
    totalPages: number;
  };
  onPageChange?: (page: number, pageSize: number) => void; // Callback cho pagination
  onSearch?: (searchTerm: string) => void; // Callback cho search
  onFilter?: (filters: { category?: string; supplier?: string; sort?: string }) => void; // Callback cho filter nâng cao
  onAddProduct?: () => void; // Callback cho thêm sản phẩm
}

// Mock data dựa trên API mẫu của bạn
const mockData: Product[] = [
  {
    productId: "15272847-a2b7-4c38-906e-39ecd74163ae",
    productName: "Coca Cola V4",
    productDescription: "Nước ngọt có gas",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758879241/imgCoca_Cola_V4_2025-09-26.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758879242/imgCoca_Cola_V4_2025-09-26.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758879243/imgCoca_Cola_V4_2025-09-26.jpg"
    ],
    productVolume: "330ml",
    productUnit: "Quyển",
    productCode: "Lon",
    productQuantity: 5,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-26T16:34:04.687352",
    updateAt: "2025-10-04T21:00:15.089171"
  },
  {
    productId: "a2dd0a09-d501-466c-864b-d68d072c7b09",
    productName: "Sách Lập Trình C# Cơ Bản",
    productDescription: "hướng dẫn học Java từ cơ bản đến nâng cao, kèm theo ví dụ minh họa thực tế.",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758270967/imgS_ch_L_p_Tr_nh_C__C__B_n_2025-09-19.png"
    ],
    productVolume: "350 trang",
    productUnit: "Quyển",
    productCode: "BOOK-JAVA-001",
    productQuantity: 4,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Đồ Uống",
    createAt: "2025-09-19T15:36:07.940441",
    updateAt: "2025-10-04T21:00:15.255789"
  },
  {
    productId: "b2f02d6b-e351-4998-bce6-3b6b4d4be6a8",
    productName: "Sách Lập Trình C++ Cơ Bản",
    productDescription: "hướng dẫn học Java từ cơ bản đến nâng cao, kèm theo ví dụ minh họa thực tế.",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758270681/imgS_ch_L_p_Tr_nh_C___C__B_n_2025-09-19.png"
    ],
    productVolume: "350 trang",
    productUnit: "Quyển",
    productCode: "BOOK-JAVA-001",
    productQuantity: 10,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: null,
    createAt: "2025-09-19T15:31:22.004749",
    updateAt: "2025-09-19T15:31:22.004749"
  },
  {
    productId: "fd2948e3-5c7d-4d9c-b047-46a985d978ac",
    productName: "Sách Lập Trình C Cơ Bản",
    productDescription: "hướng dẫn học Java từ cơ bản đến nâng cao, kèm theo ví dụ minh họa thực tế.",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758270662/imgS_ch_L_p_Tr_nh_C_C__B_n_2025-09-19.png"
    ],
    productVolume: "350 trang",
    productUnit: "Quyển",
    productCode: "BOOK-JAVA-001",
    productQuantity: 10,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: null,
    createAt: "2025-09-19T15:31:02.66515",
    updateAt: "2025-09-19T15:31:02.66515"
  },
  {
    productId: "2dee34c4-4d6c-4478-8791-ad98e0226d52",
    productName: "Coca Cola V3",
    productDescription: "Nước ngọt có gas",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757655411/imgCoca_Cola_V3_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757655413/imgCoca_Cola_V3_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757655414/imgCoca_Cola_V3_2025-09-12.jpg"
    ],
    productVolume: "330ml",
    productUnit: "Quyển",
    productCode: "Lon",
    productQuantity: 1999942,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-12T12:36:55.32105",
    updateAt: "2025-09-30T14:18:19.573614"
  },
  {
    productId: "7f373131-d445-4e32-9a81-b55c219b3795",
    productName: "Coca Cola Zero X2",
    productDescription: "Nước ngọt có gas",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654765/imgCoca_Cola_Zero_X2_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654766/imgCoca_Cola_Zero_X2_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654768/imgCoca_Cola_Zero_X2_2025-09-12.jpg"
    ],
    productVolume: "330ml",
    productUnit: "Quyển",
    productCode: "Lon",
    productQuantity: 99940,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-12T12:26:08.459891",
    updateAt: "2025-09-30T14:18:19.517003"
  },
  {
    productId: "dd1be4dc-161e-4eff-9474-a980661ab978",
    productName: "Coca Cola Zero",
    productDescription: "Nước ngọt có gas",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654287/imgCoca_Cola_Zero_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654289/imgCoca_Cola_Zero_2025-09-12.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757654290/imgCoca_Cola_Zero_2025-09-12.jpg"
    ],
    productVolume: "330ml",
    productUnit: "Quyển",
    productCode: "Lon",
    productQuantity: 100000,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-12T12:18:11.011272",
    updateAt: "2025-09-12T12:18:11.011272"
  },
  {
    productId: "5ec30443-7ca2-409a-9908-90c357bb6cca",
    productName: "Coca Cola",
    productDescription: "Nước ngọt có gas",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757173521/imgCoca_Cola_2025-09-06.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757173523/imgCoca_Cola_2025-09-06.png",
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1757173524/imgCoca_Cola_2025-09-06.jpg"
    ],
    productVolume: "330ml",
    productUnit: "Quyển",
    productCode: "Lon",
    productQuantity: 100,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-06T22:45:25.467355",
    updateAt: "2025-09-06T22:45:25.467355"
  },
  {
    productId: "a7429887-afab-45c0-b998-5a2930ae3452",
    productName: "Sách Lập Trình Java Cơ Bản",
    productDescription: "hướng dẫn học Java từ cơ bản đến nâng cao, kèm theo ví dụ minh họa thực tế.",
    productImage: [],
    productVolume: "350 trang",
    productUnit: "Quyển",
    productCode: "BOOK-JAVA-001",
    productQuantity: 100,
    discount: 0.1,
    productPrice: "132000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Sách",
    createAt: "2025-09-04T14:18:22.105669",
    updateAt: "2025-09-04T14:18:22.105669"
  },
  {
    productId: "48c24006-8965-4eee-8a85-36d5202737d8",
    productName: "Sữa tươi Vinamilk",
    productDescription: "Sữa tươi nguyên chất 1 lít",
    productImage: [
      "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758880956/imgS_a_t__i_Vinamilk_2025-09-26.png"
    ],
    productVolume: "1L",
    productUnit: "Hộp",
    productCode: "VINAMILK-001",
    productQuantity: 100,
    discount: 0.1,
    productPrice: "32000.00",
    supplierName: "Bạch Tuyết",
    colorName: "black",
    categoryName: "Đồ Uống",
    createAt: "2025-08-31T16:22:31.499336",
    updateAt: "2025-09-26T17:02:37.550876"
  }
  // Thêm 6 items nữa để totalElements=16 nếu cần demo full
];

const mockPagination = {
  size: 10,
  number: 0,
  totalElements: 16,
  totalPages: 2
};

const ProductList: React.FC<ProductListProps> = ({
  data = mockData,
  pagination = mockPagination,
  onPageChange,
  onSearch,
  onFilter,
  onAddProduct
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<string>('all'); // 'all', 'newest', 'oldest'
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>(undefined);

  // Tính toán unique categories và suppliers từ data
  const uniqueCategories = useMemo(() => {
    const categories = data
      .map((item) => item.categoryName)
      .filter((cat): cat is string => cat !== null && cat !== undefined)
      .filter((cat, index, self) => self.indexOf(cat) === index);
    return ['Tất cả', ...categories];
  }, [data]);

  const uniqueSuppliers = useMemo(() => {
    const suppliers = data
      .map((item) => item.supplierName)
      .filter((sup, index, self) => self.indexOf(sup) === index);
    return ['Tất cả', ...suppliers];
  }, [data]);

  // Columns cho Table (giữ nguyên)
  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'productDescription',
      key: 'productDescription',
      width: 200,
      ellipsis: { showTitle: true },
    },
    {
      title: 'Ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 100,
      render: (images: string[]) => images.length > 0 ? (
        <Carousel autoplay dots={false} arrows>
          {images.map((img, idx) => (
            <div key={idx}>
              <Image src={img} alt="Product" width={80} preview={false} />
            </div>
          ))}
        </Carousel>
      ) : <Text type="secondary">No image</Text>,
    },
    {
      title: 'Dung lượng',
      dataIndex: 'productVolume',
      key: 'productVolume',
      width: 100,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'productUnit',
      key: 'productUnit',
      width: 80,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      width: 80,
      render: (qty: number) => <Tag color="blue">{qty}</Tag>,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      width: 80,
      render: (disc: number) => <Tag color="green">{(disc * 100).toFixed(0)}%</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      width: 100,
      render: (price: string) => <Text strong>₫{parseFloat(price).toLocaleString('vi-VN')}</Text>,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 80,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
      render: (cat: string | null) => cat ? <Tag color="purple">{cat}</Tag> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Tạo tại',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Cập nhật tại',
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">Sửa</Button>
          <Button type="link" danger size="small">Xóa</Button>
        </Space>
      ),
    },
  ];

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle sort
  const handleSort = (type: string) => {
    setCurrentSort(type);
    onFilter?.({ sort: type });
  };

  // Handle category filter
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value === 'Tất cả' ? undefined : value);
    onFilter?.({ category: value === 'Tất cả' ? undefined : value });
  };

  // Handle supplier filter
  const handleSupplierFilter = (value: string) => {
    setSupplierFilter(value === 'Tất cả' ? undefined : value);
    onFilter?.({ supplier: value === 'Tất cả' ? undefined : value });
  };

  // Handle add product
  const handleAddProduct = () => {
    onAddProduct?.();
  };

  // Handle pagination
  const handlePageChange = (page: number, pageSize: number) => {
    onPageChange?.(page, pageSize);
  };

  // Filtered data (demo: filter theo search, category, supplier)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || item.categoryName === categoryFilter;
      const matchesSupplier = !supplierFilter || item.supplierName === supplierFilter;
      return matchesSearch && matchesCategory && matchesSupplier;
    });
  }, [data, searchTerm, categoryFilter, supplierFilter]);

  // Sort data dựa trên sort (demo frontend sort)
  const sortedData = useMemo(() => {
    let dataCopy = [...filteredData];
    if (currentSort === 'newest') {
      dataCopy.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
    } else if (currentSort === 'oldest') {
      dataCopy.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
    }
    return dataCopy;
  }, [filteredData, currentSort]);

  return (
    <div className="min-h-screen bg-white py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      {/* Title */}
      <Title level={2} className="text-center mb-4 sm:mb-6">
        Quản lý Sản phẩm
      </Title>

      {/* Filter Section - Responsive với flex-wrap */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Search - Rộng rãi hơn, full width trên mobile */}
          <div className="w-full lg:w-auto lg:flex-1">
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm, mô tả hoặc mã..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="min-w-[250px] lg:min-w-[300px] w-full"
              size="large"
              allowClear
              style={{ borderRadius: '8px', borderColor: '#d9d9d9' }}
            />
          </div>

          {/* Actions & Filters - Stack trên mobile, row trên desktop */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Button Thêm sản phẩm */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAddProduct}
              className="w-full sm:w-auto min-w-[120px]"
            >
              Thêm sản phẩm
            </Button>

            {/* Filter Category */}
            <Select
              placeholder="Lọc theo danh mục"
              value={categoryFilter || 'Tất cả'}
              onChange={handleCategoryFilter}
              options={uniqueCategories.map(cat => ({ value: cat, label: cat }))}
              className="w-full sm:w-[150px] lg:w-[160px]"
              size="large"
              suffixIcon={<FilterOutlined />}
              allowClear={false}
              showSearch
            />

            {/* Filter Supplier */}
            <Select
              placeholder="Lọc theo nhà cung cấp"
              value={supplierFilter || 'Tất cả'}
              onChange={handleSupplierFilter}
              options={uniqueSuppliers.map(sup => ({ value: sup, label: sup }))}
              className="w-full sm:w-[160px] lg:w-[170px]"
              size="large"
              suffixIcon={<FilterOutlined />}
              allowClear={false}
              showSearch
            />

            {/* Sort Buttons - Group nhỏ gọn */}
            <Space size="middle" className="flex-wrap">
              <Button
                icon={<SortAscendingOutlined />}
                onClick={() => handleSort('all')}
                type={currentSort === 'all' ? 'primary' : 'default'}
                size="large"
                className="min-w-[60px]"
              >
                Tất cả
              </Button>
              <Button
                icon={<CalendarOutlined />}
                onClick={() => handleSort('newest')}
                type={currentSort === 'newest' ? 'primary' : 'default'}
                size="large"
                className="min-w-[70px]"
              >
                Mới nhất
              </Button>
              <Button
                icon={<CalendarOutlined />}
                onClick={() => handleSort('oldest')}
                type={currentSort === 'oldest' ? 'primary' : 'default'}
                size="large"
                className="min-w-[70px]"
              >
                Cũ nhất
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Table - Responsive scroll */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={sortedData}
          pagination={false} // Tắt pagination của table, dùng component riêng
          scroll={{ x: 1400 }} // Responsive: scroll ngang trên mobile/tablet (nhiều cột)
          rowKey="productId"
          className="border-none"
          locale={{ emptyText: 'Không có dữ liệu phù hợp' }}
          size="middle" // Size nhỏ hơn trên mobile nếu cần, nhưng giữ middle cho nhất quán
        />
      </div>

      {/* Pagination - Center và responsive */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mt-4 sm:mt-6 flex justify-center">
          <Pagination
            current={pagination.number + 1}
            total={pagination.totalElements}
            pageSize={pagination.size}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            size="small" // Nhỏ hơn trên mobile
            className="lg:min-w-[400px]"
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;