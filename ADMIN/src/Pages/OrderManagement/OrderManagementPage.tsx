import React, { useState } from 'react';
import { Table, Pagination, Input, Button, Space, Typography, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined, SortAscendingOutlined, UserOutlined } from '@ant-design/icons'; // Import đầy đủ icons

const { Title, Text } = Typography;

// Interface cho Order (giả định dựa trên ecommerce)
interface Order {
  orderId: string;
  customerName: string;
  products: string[]; // Mảng tên sản phẩm
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: string;
  orderDate: string;
  updateAt: string;
}

// Props cho component
interface OrderManagementPageProps {
  data: Order[]; // Mảng content từ API
  pagination: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filterType: string) => void;
}

// Mock data (giả định 10 orders cho demo)
const mockData: Order[] = [
  {
    orderId: "ORD-001",
    customerName: "Nguyễn Văn A",
    products: ["Coca Cola V4", "Sách Lập Trình Java"],
    status: "confirmed",
    totalPrice: "264000",
    orderDate: "2025-10-01",
    updateAt: "2025-10-02T10:00:00"
  },
  {
    orderId: "ORD-002",
    customerName: "Trần Thị B",
    products: ["Sữa tươi Vinamilk"],
    status: "shipped",
    totalPrice: "32000",
    orderDate: "2025-09-30",
    updateAt: "2025-10-01T15:30:00"
  },
  // Thêm 8 items nữa tương tự để demo total=16, totalPages=2
  // ...
];

const mockPagination = {
  size: 10,
  number: 0,
  totalElements: 16,
  totalPages: 2
};

const OrderManagementPage: React.FC<OrderManagementPageProps> = ({ 
  data = mockData, 
  pagination = mockPagination,
  onPageChange,
  onSearch,
  onFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all'); // 'all', 'newest', 'oldest', 'status'

  // Status colors cho Tag
  const getStatusTag = (status: string) => {
    let color = 'default';
    switch (status) {
      case 'pending': color = 'orange'; break;
      case 'confirmed': color = 'blue'; break;
      case 'shipped': color = 'cyan'; break;
      case 'delivered': color = 'green'; break;
      case 'cancelled': color = 'red'; break;
    }
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  // Columns cho Table
  const columns: ColumnsType<Order> = [
    {
      title: 'ID Đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      width: 200,
      render: (products: string[]) => (
        <Space wrap>
          {products.slice(0, 3).map((p, idx) => <Tag key={idx}>{p}</Tag>)}
          {products.length > 3 && <Text type="secondary">+{products.length - 3}</Text>}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (price: string) => <Text strong>₫{parseFloat(price).toLocaleString('vi-VN')}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Cập nhật',
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
          <Button type="link" size="small">Chi tiết</Button>
          <Button type="link" danger size="small">Hủy</Button>
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

  // Filtered data (demo: filter theo tên KH và sản phẩm)
  const filteredData = data.filter((item) =>
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <Title level={2} className="text-center mb-6">
        Quản lý Đơn hàng Khách hàng
      </Title>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Space className="w-full justify-between flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Tìm kiếm theo tên KH hoặc sản phẩm..."
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
            <Button 
              icon={<UserOutlined />} 
              onClick={() => handleFilter('status')}
              type={currentFilter === 'status' ? 'primary' : 'default'}
            >
              Theo trạng thái
            </Button>
          </Space>
        </Space>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 1000 }} // Scroll ngang cho mobile
          rowKey="orderId"
          className="border-none"
          locale={{ emptyText: 'Không có đơn hàng' }}
        />
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex justify-center">
          <Pagination
            current={pagination.number + 1}
            total={pagination.totalElements}
            pageSize={pagination.size}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;