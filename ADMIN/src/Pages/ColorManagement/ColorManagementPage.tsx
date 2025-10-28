import React, { useState } from 'react';
import {
  Input,
  Button,
  Space,
  Typography,
  Select,
  Card,
  Row,
  Col,
  Pagination,
  Empty,
  Spin,
} from 'antd';

import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
} from '@ant-design/icons';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useGetColors } from './Hook/useGetColors';
import type { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import { useDebounce } from '@/Hook/useDebounce';
import { useGetSupplierSelections } from '../ProductManagement/Hook/useGetSupplierSelection';
import AddColorModal from './Components/AddColorModal';
import DeleteColorModal from './Components/DeleteColorModal';
import EditColorModal from './Components/EditColorModal';
import { IGetAllColor } from '@/Interface/Color/IGetAllColor';

const { Title, Text } = Typography;
const { Option } = Select;

const ColorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10); 

  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState<IGetAllColor | null>(null);

  // Hook responsive: isMobile (<576px), isTablet (576-992px)
  const isMobile = useMediaQuery('(max-width: 575.98px)');
  const isTablet = useMediaQuery('(min-width: 576px) and (max-width: 991.98px)');

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch suppliers
  const { data: supplierData, isLoading: supplierLoading } = useGetSupplierSelections();

  const suppliers: IGetSupplierSelectionResponse[] = Array.isArray(supplierData?.data)
    ? supplierData.data
    : supplierData?.data
    ? [supplierData.data]
    : [];

  // Map sortBy state sang sort param cho API (giả sử API dùng 'createAt,desc' mặc định)
  const getSortParam = () => {
    if (sortBy === 'newest') return 'createAt,desc';
    if (sortBy === 'oldest') return 'createAt,asc';
    return 'createAt,desc'; // Mặc định
  };

  // Map selectedSupplierId sang supplierName cho API
  const getSupplierName = () => {
    if (!selectedSupplierId) return undefined;
    return suppliers.find((s) => s.supplierId === selectedSupplierId)?.supplierName;
  };

  // Sử dụng hook useGetColors với params từ state
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetColors({
    keyword: debouncedSearchTerm || undefined,
    supplierName: getSupplierName(),
    page: currentPage, // 0-based pagination
    size: pageSize, // Sử dụng dynamic pageSize
    sort: getSortParam(),
  });

  // Lấy dữ liệu từ response - Sử dụng IGetAllColor thay vì Color
  const colors: IGetAllColor[] = ( apiResponse?.data?.content ?? [] ) as IGetAllColor[];
  const paginationInfo = apiResponse?.data?.page;
  const totalElements = paginationInfo?.totalElements || 0;
  const itemsPerPage = paginationInfo?.size || pageSize; // Fallback về pageSize nếu API chưa update

  // Handlers cho modal
  const handleEdit = (color: IGetAllColor) => {
    setSelectedColor(color);
    setEditModalVisible(true);
  };

  const handleDelete = (color: IGetAllColor) => {
    setSelectedColor(color);
    setDeleteModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Grid cols FIX: xs=24 (full mobile), sm=12 (2 col tablet), md=8 (3 col), lg=6 (4 col)
  const gridCols = { xs: 24, sm: 12, md: 8, lg: 6 };

  const ColorCard = ({ color }: { color: IGetAllColor }) => {
    const isSmallScreen = isMobile || isTablet; // Kết hợp mobile + tablet cho scale

    return (
      <Col {...gridCols}>
        <Card
          hoverable
          style={{
            borderRadius: '16px', // Thay rounded-2xl
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Thay shadow-lg
            transition: 'all 0.3s ease', // Thay transition-all
            marginBottom: 16, // Để tránh sát nhau trên mobile
          }}
          bodyStyle={{
            padding: isSmallScreen ? '8px' : '16px',
          }}
        >
          {/* Ảnh color cover lên */}
          <div
            className="relative overflow-hidden mb-3"
            style={{
              height: isSmallScreen ? 120 : 160,
              borderRadius: '8px',
              backgroundColor: color.colorCode,
            }}
          >
            <img
              src={color.colorImg}
              alt={color.colorName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Overlay với colorCode nếu cần, nhưng theo yêu cầu thì cover ảnh */}
          </div>

          {/* Tên color và color-code kế bên */}
          <Space direction="vertical" style={{ width: '100%', marginBottom: 8 }}>
            <Space align="start" style={{ width: '100%' }}>
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: isSmallScreen ? '0.875rem' : '1rem',
                  flex: 1,
                }}
              >
                {color.colorName}
              </Title>
              <Text
                style={{
                  fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                }}
              >
                {color.colorCode}
              </Text>
            </Space>
          </Space>

          <Text
            className="block mb-3"
            style={{
              fontSize: '0.75rem',
              color: '#6b7280', // text-gray-600
              display: '-webkit-box',
              WebkitLineClamp: 2, // Thay line-clamp-2 (CSS thuần)
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {color.colorDescription}
          </Text>

          <Space className="w-full mb-2" size="small" style={{ flexWrap: 'wrap' }}>
            {/* flex-wrap */}
            <img
              src={color.colorImg}
              alt={color.colorName}
              style={{
                borderRadius: '50%',
                width: isSmallScreen ? 16 : 24,
                height: isSmallScreen ? 16 : 24,
                objectFit: 'cover',
              }}
            />
          </Space>

          <Text style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>
            Tạo: {formatDate(color.createAt)}
          </Text>

          {/* Các nút: Edit và Delete */}
          <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 8 }}>
            <Space>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(color)}
                size="small"
                style={{ padding: 0 }}
              >
                Sửa
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(color)}
                danger
                size="small"
                style={{ padding: 0 }}
              >
                Xóa
              </Button>
            </Space>
          </Space>

          <div
            className="mt-2"
            style={{
              height: 4,
              width: '100%',
              borderRadius: '9999px', // rounded-full
              backgroundColor: color.colorCode,
            }}
          />
        </Card>
      </Col>
    );
  };

  // Xử lý error state - Cast error to Error để truy cập message
  const renderError = () => (
    <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4f' }}>
      <Title level={4}>Lỗi khi tải dữ liệu màu sắc</Title>
      <Text>{(error as Error)?.message || 'Vui lòng thử lại sau'}</Text>
    </div>
  );

  // Render grid content
  const renderGridContent = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '50px',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return renderError();
    }

    return (
      <>
        {/* Color Grid - Tăng gutter trên mobile */}
        <Row gutter={isMobile ? [0, 16] : [8, 16]}>
          {colors.map((color) => (
            <ColorCard key={color.colorId} color={color} />
          ))}
        </Row>

        {/* Empty State - Fix class */}
        {colors.length === 0 && (
          <Empty
            description={
              <Space direction="vertical" align="center" size="small">
                <Title level={3} style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                  Không tìm thấy màu nào
                </Title>
                <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                  Thử điều chỉnh bộ lọc hoặc từ khóa khác
                </Text>
              </Space>
            }
            style={{ width: '100%', textAlign: 'center' }}
            image={<span style={{ fontSize: isMobile ? '3rem' : '4rem' }}>🎨</span>}
          />
        )}

        {/* Pagination - Dựa trên API response, Antd Pagination dùng 1-based */}
        {totalElements > itemsPerPage && !isLoading && !error && (
          <Card
            style={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Row justify="space-between" align="middle" wrap>
              <Col
                span={24}
                sm={12}
                style={{
                  marginBottom: isMobile ? '8px' : 0,
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                <Text style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  Hiển thị{' '}
                  <Text strong style={{ color: '#9333ea' }}>
                    {colors.length}
                  </Text>{' '}
                  /{' '}
                  <Text strong style={{ color: '#9333ea' }}>
                    {totalElements}
                  </Text>{' '}
                  màu
                </Text>
              </Col>
              <Col
                span={24}
                sm={12}
                style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}
              >
                <Pagination
                  current={currentPage + 1} // Hiển thị 1-based cho UI
                  total={totalElements}
                  pageSize={itemsPerPage}
                  onChange={(page) => setCurrentPage(page - 1)} // Chuyển về 0-based cho API
                  onShowSizeChange={(current, size) => { // Thêm handler cho thay đổi size
                    setCurrentPage(0); // Reset về trang đầu
                    setPageSize(size);
                  }}
                  showSizeChanger={true} 
                  pageSizeOptions={['5', '10', '15', '20']} 
                  showQuickJumper={!isMobile && !isTablet}
                  itemRender={(current, type, originalElement) => {
                    if (type === 'prev') return <Button icon={<LeftOutlined />} size="small" />;
                    if (type === 'next') return <Button icon={<RightOutlined />} size="small" />;
                    return originalElement;
                  }}
                  style={{ borderRadius: '12px' }}
                  size={isMobile ? 'small' : 'default'}
                />
              </Col>
            </Row>
          </Card>
        )}
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '16px 8px' }}>
      {' '}
      {/* px-2 py-4 -> inline */}
      {/* Title */}
      <Title
        level={2}
        style={{
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: isMobile ? '1.125rem' : '1.5rem',
        }}
      >
        Quản lý các mã màu
      </Title>
      {/* Filters */}
      <Card
        style={{
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '16px',
        }}
      >
        <Space direction="vertical" style={{ width: '100%', display: 'flex', gap: '12px' }}>
          {/* Search */}
          <Row gutter={8} align="middle" wrap>
            <Col span={24}>
              <Input
                placeholder="Tìm kiếm tên, mã màu hoặc mô tả..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '12px' }}
                allowClear
                size={isMobile ? 'small' : 'middle'}
                onPressEnter={() => {
                  /* Tùy chọn: debounce search nếu cần */
                }}
              />
            </Col>
          </Row>

          {/* Sort & Supplier & Add Button */}
          <Row gutter={4} wrap>
            <Col xs={12} sm={6} md={4}>
              <Button
                onClick={() => setSortBy('all')}
                type={sortBy === 'all' ? 'primary' : 'default'}
                size="small"
                block
                style={{ borderRadius: '9999px' }} // rounded-full
              >
                Tất cả
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                onClick={() => setSortBy('newest')}
                type={sortBy === 'newest' ? 'primary' : 'default'}
                icon={<CalendarOutlined />}
                size="small"
                block
                style={{ borderRadius: '9999px' }}
              >
                Mới nhất
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                onClick={() => setSortBy('oldest')}
                type={sortBy === 'oldest' ? 'primary' : 'default'}
                icon={<CalendarOutlined />}
                size="small"
                block
                style={{ borderRadius: '9999px' }}
              >
                Cũ nhất
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={selectedSupplierId}
                onChange={(value) => setSelectedSupplierId(value as string | null)}
                placeholder="Nhà cung cấp"
                prefix={<UserOutlined />}
                size="small"
                style={{ width: '100%', borderRadius: '9999px' }}
                allowClear
                loading={supplierLoading}
                notFoundContent={supplierLoading ? <Spin size="small" /> : 'Không có dữ liệu'}
              >
                <Option value={null}>Tất cả NCC</Option>
                {suppliers.map((supplier) => (
                  <Option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.supplierName}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                type="primary"
                onClick={() => setAddModalVisible(true)}
                size="small"
                block
                style={{ borderRadius: '9999px' }}
              >
                Thêm mã màu
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                icon={<DownloadOutlined />}
                size="small"
                block
                style={{ borderRadius: '9999px' }}
              >
                Export
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>
      {/* Render grid content từ card color trở đi */}
      {renderGridContent()}
      {/* Modals */}
      <AddColorModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        suppliers={suppliers}
        onAddSuccess={refetch}
      />
      <EditColorModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        color={selectedColor || undefined}
        onSuccess={refetch}
      />
      <DeleteColorModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        colorId={selectedColor?.colorId || ''}
        colorName={selectedColor?.colorName || ''}
      />
    </div>
  );
};

export default ColorList;