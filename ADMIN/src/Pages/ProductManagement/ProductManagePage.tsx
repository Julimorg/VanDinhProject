import React, { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  Input,
  Button,
  Space,
  Typography,
  Image,
  Tag,
  Carousel,
  Select,
  Spin,
  Alert,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  SearchOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined, // Thêm icon cho nút Sửa
  DeleteOutlined, // Thêm icon cho nút Xóa
} from '@ant-design/icons';
import type { IGetAllProductResponse } from '@/Interface/Product/IGetAllProducts';
import { useDebounce } from '@/Hook/useDebounce';
import { useGetAllProducts } from './Hook/useGetAllProducts';
import { formatCurrency } from '@/Utils/ulti';
const { Title, Text } = Typography;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname !== '/products';

  //? State filters (params cho hook)
  const [filters, setFilters] = useState({
    keyword: '',
    categoryName: undefined as string | undefined,
    supplierName: undefined as string | undefined,
    page: 0,
    size: 10,
    sort: 'createAt,desc',
  });

  //? Debounce cho search
  const debouncedKeyword = useDebounce(filters.keyword, 300);

  //? Unique lists
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(['Tất cả']);
  const [uniqueSuppliers, setUniqueSuppliers] = useState<string[]>(['Tất cả']);

  const { data, isLoading, error, refetch } = useGetAllProducts(
    {
      ...filters,
      keyword: debouncedKeyword, // Chỉ refetch khi debounce xong
    },
    {
      enabled: !isChildRoute, // Disable query khi ở child route (không fetch data)
    }
  );

  const products = React.useMemo(
    () => (data?.data?.content || []) as IGetAllProductResponse[],
    [data?.data?.content]
  );

  const pagination = data?.data?.page || {
    size: filters.size,
    number: filters.page,
    totalElements: 0,
    totalPages: 0,
  };

  //?  Update unique lists
  useEffect(() => {
    if (products.length > 0) {
      const categories = [
        'Tất cả',
        ...new Set(
          products
            .map((p) => p.categoryName)
            .filter((c): c is string => c !== null && c !== undefined)
        ),
      ];
      const suppliers = ['Tất cả', ...new Set(products.map((p) => p.supplierName))];
      setUniqueCategories(categories);
      setUniqueSuppliers(suppliers);
    }
  }, [products]);

  const columns: ColumnsType<IGetAllProductResponse> = [
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
      title: 'Ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 100,
      render: (images: string[]) =>
        images.length > 0 ? (
          <Carousel autoplay dots={false} arrows>
            {images.map((img, idx) => (
              <div key={idx}>
                <Image src={img} alt="Product" width={80} preview={false} />
              </div>
            ))}
          </Carousel>
        ) : (
          <Text type="secondary">No image</Text>
        ),
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
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      width: 80,
      render: (qty: number) => <Tag color="blue">{qty}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      width: 100,
      render: (price: number) => <Text strong>{formatCurrency(price)}</Text>,
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
      render: (cat: string) =>
        cat ? <Tag color="purple">{cat}</Tag> : <Text type="secondary">N/A</Text>,
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
      width: 150, 

      render: (_: any, record: IGetAllProductResponse) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/products/product-detail/${record.productId}`)} 
          >
            Xem 
          </Button>
         
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/edit/${record.productId}`)}
          >
            Sửa
          </Button>

          <Button 
            type="link" 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => {
              // TODO: Implement confirm delete (ví dụ dùng Modal)
              console.log('Xóa sản phẩm:', record.productId);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value, page: 0 }));
  };

  const handleSort = (type: string) => {
    let newSort = 'createAt,desc';
    if (type === 'newest') newSort = 'createAt,desc';
    else if (type === 'oldest') newSort = 'createAt,asc';
    setFilters((prev) => ({ ...prev, sort: newSort, page: 0 }));
  };

  const handleCategoryFilter = (value: string) => {
    const category = value === 'Tất cả' ? undefined : value;
    setFilters((prev) => ({ ...prev, categoryName: category, page: 0 }));
  };

  const handleSupplierFilter = (value: string) => {
    const supplier = value === 'Tất cả' ? undefined : value;
    setFilters((prev) => ({ ...prev, supplierName: supplier, page: 0 }));
  };

  const handleAddProduct = () => {
    navigate('/products/create');
  };

  const handlePageChange = (currentPage: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page: currentPage - 1, size: pageSize }));
  };

  if (!isChildRoute && error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Alert
          message="Lỗi tải dữ liệu"
          description={
            (error as Error).message || 'Không thể kết nối đến server. Vui lòng thử lại.'
          }
          type="error"
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      {!isChildRoute ? (
        <>
          <Title level={2} className="text-center mb-4 sm:mb-6">
            Quản lý Sản phẩm
          </Title>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="w-full lg:w-auto lg:flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm, mô tả hoặc mã..."
                  prefix={<SearchOutlined />}
                  value={filters.keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="min-w-[250px] lg:min-w-[300px] w-full"
                  size="large"
                  allowClear
                  onClear={() => handleSearch('')}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddProduct}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  Thêm sản phẩm
                </Button>

                <Select
                  placeholder="Lọc theo danh mục"
                  value={filters.categoryName || 'Tất cả'}
                  onChange={handleCategoryFilter}
                  options={uniqueCategories.map((cat) => ({ value: cat, label: cat }))}
                  className="w-full sm:w-[150px] lg:w-[160px]"
                  size="large"
                  suffixIcon={<FilterOutlined />}
                  allowClear={false}
                  showSearch
                />

                <Select
                  placeholder="Lọc theo nhà cung cấp"
                  value={filters.supplierName || 'Tất cả'}
                  onChange={handleSupplierFilter}
                  options={uniqueSuppliers.map((sup) => ({ value: sup, label: sup }))}
                  className="w-full sm:w-[160px] lg:w-[170px]"
                  size="large"
                  suffixIcon={<FilterOutlined />}
                  allowClear={false}
                  showSearch
                />

                <Space size="middle" className="flex-wrap">
                  <Button
                    icon={<SortAscendingOutlined />}
                    onClick={() => handleSort('all')}
                    type={filters.sort === 'createAt,desc' ? 'primary' : 'default'}
                    size="large"
                    className="min-w-[60px]"
                  >
                    Tất cả
                  </Button>
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSort('newest')}
                    type={filters.sort === 'createAt,desc' ? 'primary' : 'default'}
                    size="large"
                    className="min-w-[70px]"
                  >
                    Mới nhất
                  </Button>
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => handleSort('oldest')}
                    type={filters.sort === 'createAt,asc' ? 'primary' : 'default'}
                    size="large"
                    className="min-w-[70px]"
                  >
                    Cũ nhất
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Spin spinning={isLoading}>
              <Table<IGetAllProductResponse>
                columns={columns}
                dataSource={products}
                pagination={false}
                scroll={{ x: 1500 }}
                rowKey="productId"
                className="border-none"
                locale={{ emptyText: 'Không có dữ liệu phù hợp' }}
                size="middle"
              />
            </Spin>
          </div>

          {/* Pagination */}
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
                size="small"
                className="lg:min-w-[400px]"
              />
            </div>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default ProductList;