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
  List,
  Modal,
  Upload,
  Divider,
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
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { IGetAllProductResponse } from '@/Interface/Product/IGetAllProducts';
import { useDebounce } from '@/Hook/useDebounce';
import { useGetAllProducts } from './Hook/useGetAllProducts';
import { formatCurrency } from '@/Utils/ulti';
import ConfirmDeleteModal from './Components/DeleteProductModal';
import UpdateProductQuantityModal from './Components/UpdateProductQuantityModal';
import { IImportRowError } from '@/Interface/Product/IImportExcelFile';
import {
  useImportProductExcel,
  useDownloadProductImportTemplate,
  ImportExcelError,
} from './Hook/useImportProductExcel';
const { Title, Text } = Typography;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname !== '/products';

  const [importErrorModalOpen, setImportErrorModalOpen] = useState(false);
  const [importRowErrors, setImportRowErrors] = useState<IImportRowError[]>([]);

  const importExcelMutation = useImportProductExcel();
  const downloadTemplateMutation = useDownloadProductImportTemplate();

  const handleImportExcel = (file: File) => {
    importExcelMutation.mutate(file, {
      onSuccess: () => {
        refetch();
      },
      onError: (error: ImportExcelError) => {
        if (error.rowErrors?.length) {
          setImportRowErrors(error.rowErrors);
          setImportErrorModalOpen(true);
        }
      },
    });
    return false;
  };
  //? State filters (params cho hook)
  const [filters, setFilters] = useState({
    keyword: '',
    categoryName: undefined as string | undefined,
    supplierName: undefined as string | undefined,
    page: 0,
    size: 5,
    sort: 'createAt,desc',
  });

  //? State cho modal xóa
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IGetAllProductResponse | null>(null);

  //? Debounce cho search
  const debouncedKeyword = useDebounce(filters.keyword, 300);

  //? Unique lists
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(['Tất cả']);
  const [uniqueSuppliers, setUniqueSuppliers] = useState<string[]>(['Tất cả']);

  const { data, isLoading, error, refetch } = useGetAllProducts(
    {
      ...filters,
      keyword: debouncedKeyword,
    },
    {
      enabled: !isChildRoute,
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

  //modal sửa số lượng
  const [editQuantityModal, setEditQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IGetAllProductResponse | null>(null);

  const columns: ColumnsType<IGetAllProductResponse> = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Mã SP',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 130,
      render: (code: string) =>
        code ? <Text code>{code}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render: (text) => (
        <Text strong style={{ fontSize: 15 }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 140,
      render: (images: string[]) =>
        images.length > 0 ? (
          <Carousel autoplay dots={false} arrows>
            {images.map((img, idx) => (
              <div key={idx}>
                <Image
                  src={img}
                  alt="Product"
                  width={110}
                  height={110}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                  preview={false}
                />
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
      width: 120,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'productUnit',
      key: 'productUnit',
      width: 100,
    },
    {
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      width: 110,
      render: (qty: number) => (
        <Tag color="blue" style={{ fontSize: 14, padding: '2px 10px' }}>
          {qty}
        </Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      width: 140,
      render: (price: number) => (
        <Text strong style={{ fontSize: 15 }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 110,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 130,
      render: (cat: string) =>
        cat ? <Tag color="purple">{cat}</Tag> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Tạo tại',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Cập nhật tại',
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 340,
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
            onClick={() => {
              setSelectedProduct(record);
              setEditQuantityModal(true);
            }}
          >
            Chỉnh sửa số lượng
          </Button>

          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setProductToDelete(record);
              setDeleteModalVisible(true);
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

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setProductToDelete(null);
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

          {/* Actions + Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            {/* Hàng 1 — Tìm kiếm + Hành động chính */}
            <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <Input
                placeholder="Tìm kiếm theo tên sản phẩm, mô tả hoặc mã..."
                prefix={<SearchOutlined />}
                value={filters.keyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full lg:max-w-[380px]"
                size="large"
                allowClear
                onClear={() => handleSearch('')}
                style={{ borderRadius: '8px' }}
              />

              <Space size="small" wrap className="w-full lg:w-auto justify-end">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddProduct}
                  className="min-w-[140px]"
                >
                  Thêm sản phẩm
                </Button>

                <Space.Compact>
                  <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={handleImportExcel}>
                    <Button icon={<UploadOutlined />} size="large" loading={importExcelMutation.isPending}>
                      Import Excel
                    </Button>
                  </Upload>
                  <Button
                    icon={<DownloadOutlined />}
                    size="large"
                    onClick={() => downloadTemplateMutation.mutate()}
                    loading={downloadTemplateMutation.isPending}
                  >
                    Tải Template
                  </Button>
                </Space.Compact>
              </Space>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Hàng 2 — Bộ lọc */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              <Text type="secondary" className="hidden sm:inline whitespace-nowrap">
                Bộ lọc:
              </Text>

              <Select
                placeholder="Lọc theo danh mục"
                value={filters.categoryName || 'Tất cả'}
                onChange={handleCategoryFilter}
                options={uniqueCategories.map((cat) => ({ value: cat, label: cat }))}
                className="w-full sm:w-[160px]"
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
                className="w-full sm:w-[170px]"
                size="large"
                suffixIcon={<FilterOutlined />}
                allowClear={false}
                showSearch
              />

              <Space.Compact className="ml-0 sm:ml-2">
                <Button
                  icon={<SortAscendingOutlined />}
                  onClick={() => handleSort('all')}
                  type={filters.sort === 'createAt,desc' ? 'primary' : 'default'}
                  size="large"
                >
                  Tất cả
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => handleSort('newest')}
                  type={filters.sort === 'createAt,desc' ? 'primary' : 'default'}
                  size="large"
                >
                  Mới nhất
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => handleSort('oldest')}
                  type={filters.sort === 'createAt,asc' ? 'primary' : 'default'}
                  size="large"
                >
                  Cũ nhất
                </Button>
              </Space.Compact>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Spin spinning={isLoading}>
              <Table<IGetAllProductResponse>
                columns={columns}
                dataSource={products}
                pagination={false}
                scroll={{ x: 2100 }}
                rowKey="productId"
                className="border-none"
                locale={{ emptyText: 'Không có dữ liệu phù hợp' }}
                size="large"
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
                disabled={pagination.totalPages <= 1}
              />
            </div>
          )}
        </>
      ) : (
        <Outlet />
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        productId={productToDelete?.productId || ''}
        productName={productToDelete?.productName || ''}
        onSuccess={refetch}
      />

      {/* Modal chỉnh số lượng sản phẩm */}
      <UpdateProductQuantityModal
        visible={editQuantityModal}
        product={selectedProduct}
        onCancel={() => {
          setEditQuantityModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          setEditQuantityModal(false);
          setSelectedProduct(null);
          refetch();
        }}
      />

      {/* Modal hiển thị chi tiết lỗi import Excel */}
      <Modal
        title={`Import thất bại — ${importRowErrors.length} dòng bị lỗi`}
        open={importErrorModalOpen}
        onCancel={() => setImportErrorModalOpen(false)}
        footer={
          <Button key="close" onClick={() => setImportErrorModalOpen(false)}>
            Đóng
          </Button>
        }
        width={600}
      >
        <List
          dataSource={importRowErrors}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`Dòng ${item.rowNumber}`}
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    {item.messages.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ProductList;