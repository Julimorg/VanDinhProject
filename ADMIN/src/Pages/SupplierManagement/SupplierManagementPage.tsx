import React, { useState } from 'react';
import { Table, Pagination, Input, Button, Space, Typography, Card } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined, DownOutlined, CalendarOutlined } from '@ant-design/icons';

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
}

// Mock data - Tăng lên 15 items để demo pagination (size=10, totalPages=2)
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
  },
  // Thêm thêm 12 items giả để tổng 15
  ...Array.from({ length: 12 }, (_, index) => ({
    supplierId: `mock-${index + 1}`,
    supplierName: `Nhà cung cấp Mock ${index + 1}`,
    supplierAddress: `Địa chỉ ${index + 1}`,
    supplierPhone: `0${index}0000000`,
    supplierEmail: `mock${index + 1}@gmail.com`,
    supplierImg: "https://example.com/img-mock.png",
    createAt: `2025-08-${20 - index}T10:00:00.00000`,
    updateAt: `2025-08-${20 - index}T10:00:00.00000`
  }))
];

const mockPagination = {
  size: 10, // 10 items/trang
  number: 0, // Trang đầu (0-based)
  totalElements: 15, // Tổng 15 items
  totalPages: 2 // 2 trang
};

const SupplierManagementPage: React.FC<SupplierListProps> = ({ 
  data = mockData, 
  pagination = mockPagination,
  onPageChange,
  onSearch 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Columns cho Table với sorter (client-side cho demo)
  // Lưu ý: Để responsive thực sự, thêm CSS media queries riêng (ẩn columns trên mobile)
  const columns: ColumnsType<Supplier> = [
    {
      title: 'ID',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 120,
      ellipsis: true,
      // Ẩn trên mobile qua CSS: .ant-table-column-supplierId { @media (max-width: 640px) { display: none; } }
      sorter: (a: Supplier, b: Supplier) => a.supplierId.localeCompare(b.supplierId),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Tên nhà cung cấp
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a: Supplier, b: Supplier) => a.supplierName.localeCompare(b.supplierName),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Địa chỉ
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierAddress',
      key: 'supplierAddress',
      width: 120,
      // Ẩn trên tablet/mobile qua CSS
      sorter: (a: Supplier, b: Supplier) => a.supplierAddress.localeCompare(b.supplierAddress),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Điện thoại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierPhone',
      key: 'supplierPhone',
      width: 120,
      // Ẩn trên tablet/mobile qua CSS
      sorter: (a: Supplier, b: Supplier) => a.supplierPhone.localeCompare(b.supplierPhone),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Email
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierEmail',
      key: 'supplierEmail',
      width: 180,
      ellipsis: true,
      // Ẩn trên tablet/mobile qua CSS
      sorter: (a: Supplier, b: Supplier) => a.supplierEmail.localeCompare(b.supplierEmail),
      showSorterTooltip: false,
    },
    {
      title: 'Ảnh',
      dataIndex: 'supplierImg',
      key: 'supplierImg',
      width: 80,
      render: (img: string) => <img src={img} alt="Supplier" className="w-10 h-10 rounded object-cover" />,
      // Ẩn trên mobile qua CSS
    },
    {
      title: (
        <span className="flex items-center">
          Tạo tại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'createAt',
      key: 'createAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: Supplier, b: Supplier) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Cập nhật tại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: Supplier, b: Supplier) => new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime(),
      showSorterTooltip: false,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap className="flex flex-col sm:flex-row">
          <Button type="link" size="small" className="p-0">Sửa</Button>
          <Button type="link" danger size="small" className="p-0">Xóa</Button>
        </Space>
      ),
    },
  ];

  // Handle search với debounce đơn giản (client-side)
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle pagination - Chuyển page sang 0-based nếu API yêu cầu
  const handlePageChange = (page: number, pageSize: number) => {
    // Giả sử API dùng 0-based, trừ 1
    onPageChange?.(page - 1, pageSize);
  };

  // Filtered data (demo: filter theo tên)
  const filteredData = data.filter((item) =>
    item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplierEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table props với sorter
  const tableProps: Partial<TableProps<Supplier>> = {
    onChange: (pagination, filters, sorter) => {
      console.log('Sorter:', sorter); // Có thể gửi lên parent nếu cần server-side sort
    },
  };

  // Locale cho Pagination (tiếng Việt)
  const paginationLocale = {
    items_per_page: 'mục / trang',
    jump_to: 'Đi đến',
    jump_to_confirm: 'xác nhận',
    page_size: 'số trang',
    prev_page: 'Trang trước',
    next_page: 'Trang sau',
    prev_5: '5 trang trước',
    next_5: '5 trang sau',
    prev_3: '3 trang trước',
    next_3: '3 trang sau',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Title level={2} className="text-center sm:text-left text-gray-900 mb-2 text-lg sm:text-xl">
          Quản lý Nhà cung cấp
        </Title>
        <Text type="secondary" className="block text-sm text-center sm:text-left">
          Tổng số: {pagination.totalElements} nhà cung cấp
        </Text>
      </div>

      {/* Search Section - Thiết kế đẹp hơn với Card */}
      <Card 
        className="mb-6 shadow-sm border-0 bg-white rounded-xl"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên nhà cung cấp hoặc email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500"
              size="large"
              allowClear
              style={{ minWidth: '250px' }}
            />
          </div>
          <Text type="secondary" className="text-sm self-center hidden sm:block">
            Nhấn Enter để tìm kiếm
          </Text>
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false} // Tắt pagination của table, dùng component riêng
          scroll={{ x: 768 }} // Responsive: scroll ngang trên mobile/tablet
          rowKey="supplierId"
          className="border-none"
          locale={{ emptyText: <div className="text-center py-8"><Text>Không có dữ liệu</Text></div> }}
          {...tableProps}
          size="middle"
        />
      </div>

      {/* Pagination - Cải thiện UI/UX: Responsive, locale tiếng Việt, center tốt hơn trên mobile */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-center">
        <Pagination
          current={pagination.number + 1} // 1-based cho UI
          total={pagination.totalElements}
          pageSize={pagination.size}
          showSizeChanger={window.innerWidth >= 768} // Chỉ showSizeChanger trên desktop/tablet
          showQuickJumper={window.innerWidth >= 1024} // Chỉ quick jumper trên large screen
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} nhà cung cấp`}
          onChange={handlePageChange}
          locale={paginationLocale}
          className="w-auto" // Không full width, tự adjust
          size={window.innerWidth < 768 ? 'small' : 'default'} // Size nhỏ trên mobile
        />
      </div>
    </div>
  );
};

export default SupplierManagementPage;