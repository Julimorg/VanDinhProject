import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Table, Pagination, Input, Button, Space, Typography, Image, Card, Modal, Row, Col, Grid, Spin, } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined, SortAscendingOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, } from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import CreateCategoryModal from './Components/CreateCategoryModal';
import CategoryDetail from './Components/CategoryDetai';
import EditCategoryModal from './Components/EditCategoryModal';
import type { IGetCategoryDetailResponse } from '@/Interface/Category/IGetCategoryDetail';
import { useGetAllCategory } from './Hook/useGetCategory';
import { useDebounce } from '@/Hook/useDebounce';
import DeleteCategoryModal from './Components/DeleteCategoryModal';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailView = location.pathname.match(/^\/category\/[^/]+$/);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const screens = useBreakpoint();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  })
  //search term
  //debounce
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const { data, isLoading, error, refetch } = useGetAllCategory({
    page: page.number,
    size: page.size,

    sort: currentFilter === 'newest' ? 'createAt,desc' : currentFilter === 'oldest' ? 'createAt,asc' : undefined,
    keyword: debouncedSearch,
  });

  useEffect(() => {
    if (error) {
      console.error('Lỗi fetch categories:', error);
    }
  }, [error]);

  

  const categories = data?.data?.content || [];
  const pagination = data?.data?.page || page;


  const columns: ColumnsType<any> = [
    {
      title: 'Ảnh',
      dataIndex: 'categoryImage',
      key: 'categoryImage',
      width: 80,
      render: (img: string) => (
        <Image src={img} alt="Category" width={40} height={40} className="object-cover rounded" preview />
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 100,
      ellipsis: true,
      render: (text: string) => (
        <div
          style={{
            maxWidth: 100,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </div>
      ),
      responsive: ['md', 'lg'],
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'Mô tả',
      dataIndex: 'categoryDescription',
      key: 'categoryDescription',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <div
          style={{
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </div>
      ),
      responsive: ['sm', 'md', 'lg'],
    },
    {
      title: 'Tạo tại',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      responsive: ['md', 'lg'],
    },
    {
      title: 'Cập nhật tại',
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      responsive: ['md', 'lg'],
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size={0} className="flex justify-between">
          <Button
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => navigate(`${record.categoryId}`)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setSelectedCategory(record);
              setIsUpdateModalOpen(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            danger
            onClick={() => {
              setSelectedCategoryForDelete(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
  ];
  const handleCreateCategory = (values: any) => {
    console.log('New Category:', values);
    setIsCreateModalOpen(false);
  };

  // const handleSearch = (value: string) => {
  //   setSearchTerm(value);
  //   onSearch?.(value);
  // };

  const handleFilter = (type: string) => {
    setCurrentFilter(type);
    setPage({ ...page, number: 0 }); // reset về page 1
  };

  const handlePageChange = (pageNumber: number, pageSize: number) => {
    setPage({
      ...page,
      number: pageNumber - 1,
      size: pageSize,
    })
  };

  // const filteredData = data.filter(
  //   (item) =>
  //     item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  const clearTokens = useAuthStore((s) => s.clearTokens);

  const handleLogout = () => {
    clearTokens();
    localStorage.clear(); // Xóa toàn bộ cache frontend
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isDetailView ? (
        <Outlet />
      ) : (

        <Card className="max-w-7xl mx-auto shadow-lg">
          <Title level={2} className="text-center mb-6 text-blue-600">
            Quản lý Danh mục
          </Title>
          <button onClick={handleLogout}>Đăng xuất</button>;
          {/* Thanh công cụ responsive */}

          <div className="mb-6">
            <Row gutter={[16, 16]} justify="space-between" align="middle">
              <Col xs={24} sm={24} md={10} lg={8}>
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mô tả..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>

              <Col xs={24} sm={24} md={14} lg={16}>
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '8px',
                    paddingBottom: 4,
                  }}
                >
                  <Space
                    wrap
                    style={{
                      width: '100%',
                      justifyContent: screens.xs ? 'center' : 'flex-end',
                      flexWrap: 'wrap',
                      rowGap: 8,
                    }}
                  >
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      size={screens.xs ? 'middle' : 'large'}
                      className="bg-[#1cac86] hover:bg-green-600"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Thêm danh mục
                    </Button>


                    <Button
                      icon={<SortAscendingOutlined />}
                      onClick={() => handleFilter('all')}
                      type={currentFilter === 'all' ? 'primary' : 'default'}
                      size={screens.xs ? 'middle' : 'large'}
                    >
                      Tất cả
                    </Button>

                    <Button
                      icon={<CalendarOutlined />}
                      onClick={() => handleFilter('newest')}
                      type={currentFilter === 'newest' ? 'primary' : 'default'}
                      size={screens.xs ? 'middle' : 'large'}
                    >
                      Mới nhất
                    </Button>

                    <Button
                      icon={<CalendarOutlined />}
                      onClick={() => handleFilter('oldest')}
                      type={currentFilter === 'oldest' ? 'primary' : 'default'}
                      size={screens.xs ? 'middle' : 'large'}
                    >
                      Cũ nhất
                    </Button>

                    {/*====== Modals ===== */}
                    <CreateCategoryModal
                      open={isCreateModalOpen}
                      onCancel={() => setIsCreateModalOpen(false)}
                    // onCreate={handleCreateCategory}
                    />

                    <EditCategoryModal
                      open={isUpdateModalOpen}
                      categoryId={selectedCategory?.categoryId}
                      initialData={selectedCategory}
                      onCancel={() => setIsUpdateModalOpen(false)}
                    />

                    <DeleteCategoryModal
                      open={isDeleteModalOpen}
                      categoryId={selectedCategoryForDelete?.categoryId}
                      categoryName={selectedCategoryForDelete?.categoryName}
                      onCancel={() => setIsDeleteModalOpen(false)}
                      onDeleteSuccess={refetch}
                    />
                  </Space>
                </div>
              </Col>
            </Row>

          </div>


          {/* Bảng danh mục */}
          <Spin spinning={isLoading} style={{ marginTop: 24 }}>
            <Table
              columns={columns}
              dataSource={categories}
              pagination={false}
              scroll={{ x: 'max-content' }}
              rowKey="categoryId"
              className="border-none rounded-lg"
              locale={{ emptyText: 'Không có dữ liệu' }}
              rowClassName="hover:bg-gray-50"
            />
          </Spin>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={pagination.number + 1}
                total={pagination.totalElements}
                pageSize={pagination.size}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} danh mục`}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                className="ant-pagination-responsive"
              />
            </div>
          )}

        </Card>
      )}
    </div>
  );
};

export default CategoryManagementPage;
