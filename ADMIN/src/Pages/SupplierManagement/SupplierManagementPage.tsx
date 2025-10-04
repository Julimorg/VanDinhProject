import React, { useState } from 'react';
import { Table, Pagination, Input, Button, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Interface cho Supplier dựa trên API response
interface Supplier {
  supplierId: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierImg: string;
  createAt: string;
  updateAt: string;
}

// Props cho component
interface SupplierListProps {
  data: Supplier[]; // Mảng content từ API
  pagination: {
    size: number;
    number: number; // Trang hiện tại (bắt đầu từ 0 hoặc 1 tùy API)
    totalElements: number;
    totalPages: number;
  };
  onPageChange?: (page: number, pageSize: number) => void; // Callback cho pagination
  onSearch?: (searchTerm: string) => void; // Callback cho search
  onFilter?: (filterType: string) => void; // Callback cho filter
}

// Mock data dựa trên API mẫu của bạn (thay bằng fetch thực tế)
const mockData: Supplier[] = [
  {
    supplierId: "9d50a6fd-c8f1-4107-ba48-4ba2a43c9cba",
    supplierName: "Bạch Tuyết",
    supplierAddress: "tp Hcm",
    supplierPhone: "1243124112",
    supplierEmail: "bachtuyet@gmail.com",
    supplierImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1755956467/imgScreenshot%202025-07-24%20123345.png.png",
    createAt: "2025-08-23T20:49:12.42264",
    updateAt: "2025-08-23T20:49:12.42264"
  },
  // Thêm 2 item nữa để demo totalElements=3
  {
    supplierId: "abc123",
    supplierName: "Công ty ABC",
    supplierAddress: "Hà Nội",
    supplierPhone: "0987654321",
    supplierEmail: "abc@gmail.com",
    supplierImg: "https://example.com/img1.png",
    createAt: "2025-08-22T10:00:00.00000",
    updateAt: "2025-08-22T10:00:00.00000"
  },
  {
    supplierId: "def456",
    supplierName: "Doanh nghiệp DEF",
    supplierAddress: "Đà Nẵng",
    supplierPhone: "0123456789",
    supplierEmail: "def@gmail.com",
    supplierImg: "https://example.com/img2.png",
    createAt: "2025-08-21T15:30:00.00000",
    updateAt: "2025-08-21T15:30:00.00000"
  }
];

const mockPagination = {
  size: 1,
  number: 2, // Trang 3 (nếu bắt đầu từ 0)
  totalElements: 3,
  totalPages: 3
};

const SupplierManagementPage: React.FC<SupplierListProps> = ({ 
  data = mockData, 
  pagination = mockPagination,
  onPageChange,
  onSearch,
  onFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all'); // 'all', 'newest', 'oldest'

  // Columns cho Table (responsive: ẩn một số cột trên mobile qua CSS)
  const columns: ColumnsType<Supplier> = [
    {
      title: 'ID',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'supplierAddress',
      key: 'supplierAddress',
      width: 120,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'supplierPhone',
      key: 'supplierPhone',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'supplierEmail',
      key: 'supplierEmail',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Ảnh',
      dataIndex: 'supplierImg',
      key: 'supplierImg',
      width: 80,
      render: (img: string) => <img src={img} alt="Supplier" className="w-10 h-10 rounded object-cover" />,
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

  // Handle filter
  const handleFilter = (type: string) => {
    setCurrentFilter(type);
    onFilter?.(type);
  };

  // Handle pagination
  const handlePageChange = (page: number, pageSize: number) => {
    onPageChange?.(page, pageSize);
  };

  // Filtered data (demo: filter theo tên)
  const filteredData = data.filter((item) =>
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="text-center sm:text-left text-gray-900 mb-2">
          Quản lý Nhà cung cấp
        </Title>
        <Text type="secondary" className="block text-sm">
          Tổng số: {pagination.totalElements} nhà cung cấp
        </Text>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Space className="w-full justify-between flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Tìm kiếm theo tên nhà cung cấp..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
              allowClear
            />
          </div>

          {/* Filter Buttons */}
          <Space>
            <Button 
              icon={<SortAscendingOutlined />} 
              onClick={() => handleFilter('all')}
              type={currentFilter === 'all' ? 'primary' : 'default'}
            >
              Tất cả
            </Button>
            <Button 
              icon={<CalendarOutlined />} 
              onClick={() => handleFilter('newest')}
              type={currentFilter === 'newest' ? 'primary' : 'default'}
            >
              Mới nhất
            </Button>
            <Button 
              icon={<CalendarOutlined />} 
              onClick={() => handleFilter('oldest')}
              type={currentFilter === 'oldest' ? 'primary' : 'default'}
            >
              Cũ nhất
            </Button>
          </Space>
        </Space>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false} // Tắt pagination của table, dùng component riêng
          scroll={{ x: 768 }} // Responsive: scroll ngang trên mobile/tablet
          rowKey="supplierId"
          className="border-none"
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex justify-center">
          <Pagination
            current={pagination.number + 1} // Chuyển sang 1-based nếu cần
            total={pagination.totalElements}
            pageSize={pagination.size}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} nhà cung cấp`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SupplierManagementPage;