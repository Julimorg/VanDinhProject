import React, { useState } from 'react';
import { Table, Pagination, Input, Button, Space, Typography, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Interface cho Category dựa trên API response
interface Category {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  categoryImage: string;
  createAt: string;
  updateAt: string;
}

// Props cho component
interface CategoryListProps {
  data: Category[]; // Mảng content từ API
  pagination: {
    size: number;
    number: number; // Trang hiện tại
    totalElements: number;
    totalPages: number;
  };
  onPageChange?: (page: number, pageSize: number) => void; // Callback cho pagination
  onSearch?: (searchTerm: string) => void; // Callback cho search
  onFilter?: (filterType: string) => void; // Callback cho filter
}

// Mock data dựa trên API mẫu của bạn
const mockData: Category[] = [
  {
    categoryId: "0d0a5f1a-e3bc-4cd1-abf9-cd070e0c70b6",
    categoryName: "Sách",
    categoryDescription: "Danh mục các loại sách như tiểu thuyết, kỹ năng, giáo trình, truyện tranh",
    categoryImage: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1756970278/imgS_ch_2025-09-04.png",
    createAt: "2025-09-04T14:17:58.677137",
    updateAt: "2025-09-04T14:17:58.677137"
  },
  {
    categoryId: "550518ac-f0ec-4c66-9ce2-bfff2de7feb0",
    categoryName: "Đồ Uống",
    categoryDescription: "Các loại nước giải khát, cà phê, trà",
    categoryImage: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758882090/img___U_ng_2025-09-26.png",
    createAt: "2025-09-04T13:58:37.662618",
    updateAt: "2025-09-26T17:21:30.956066"
  }
];

const mockPagination = {
  size: 10,
  number: 0,
  totalElements: 2,
  totalPages: 1
};

const CategoryList: React.FC<CategoryListProps> = ({ 
  data = mockData, 
  pagination = mockPagination,
  onPageChange,
  onSearch,
  onFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all'); // 'all', 'newest', 'oldest'

  // Columns cho Table (responsive: ẩn một số cột trên mobile qua CSS)
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'categoryDescription',
      key: 'categoryDescription',
      width: 250,
      ellipsis: { showTitle: true },
    },
    {
      title: 'Ảnh',
      dataIndex: 'categoryImage',
      key: 'categoryImage',
      width: 80,
      render: (img: string) => <Image src={img} alt="Category" width={40} preview={false} />,
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

  // Filtered data (demo: filter theo tên và mô tả)
  const filteredData = data.filter((item) =>
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <Title level={2} className="text-center mb-6">
        Quản lý Danh mục
      </Title>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Space className="w-full justify-between flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
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
          rowKey="categoryId"
          className="border-none"
          locale={{ emptyText: 'Không có dữ liệu' }}
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
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} danh mục`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList;