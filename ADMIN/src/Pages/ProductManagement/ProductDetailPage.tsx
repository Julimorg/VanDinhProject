import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Image,
  Spin,
  Alert,
  Typography,
  Space,
  Tag,
  Button,
} from 'antd';
import {
  ArrowLeftOutlined,
  BarcodeOutlined,
  DropboxOutlined,
  DatabaseOutlined,
  TagOutlined,
  UserOutlined,
  FolderOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '@/Utils/ulti';
import { useGetProductDetail } from './Hook/useGetProductDetail';

const { Title, Text } = Typography;

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data, isLoading, error } = useGetProductDetail(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Alert
            message={error ? "Lỗi tải chi tiết sản phẩm" : "Sản phẩm không tồn tại"}
            description={error ? "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau." : "Không tìm thấy thông tin sản phẩm."}
            type={error ? "error" : "warning"}
            showIcon
          />
        </div>
      </div>
    );
  }

  const product = data.data;

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parsedPrice = typeof product.productPrice === 'string'
    ? parseFloat(product.productPrice)
    : product.productPrice || 0;
  const discountPrice = parsedPrice * (1 - (product.discount || 0));

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      {/* Header gọn gàng */}
      <div className="mb-6 flex items-center justify-between max-w-6xl mx-auto">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          size="large"
          className="text-gray-600 hover:text-gray-800"
        >
          Quay lại
        </Button>
        <Title level={2} className="m-0 !text-gray-800">
          Chi Tiết Sản Phẩm
        </Title>
        <div className="w-8" />
      </div>

      {/* Main Card */}
      <Card className="max-w-6xl mx-auto !shadow-sm !border-gray-200">
        <Row gutter={[32, 32]}>
          {/* Ảnh - 40% desktop, full mobile */}
          <Col xs={24} lg={10}>
            <div className="space-y-4">
              {/* Ảnh chính */}
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                <Image
                  src={product.productImage[activeImageIndex] || "https://via.placeholder.com/400?text=No+Image"}
                  alt={product.productName}
                  className="w-full h-full object-contain p-4"
                  preview={true}
                />
              </div>
              {/* Thumbnails */}
              {product.productImage && product.productImage.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.productImage.map((img, idx) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 cursor-pointer p-1 rounded-lg border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleThumbnailClick(idx)}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                        preview={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Thông tin - 60% desktop */}
          <Col xs={24} lg={14}>
            <div className="space-y-6">
              {/* Tên & Giá */}
              <div className="space-y-2">
                <Title level={3} className="!m-0 !text-gray-900">
                  {product.productName}
                </Title>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Text strong className="text-3xl text-red-500">
                      {formatCurrency(discountPrice)}
                    </Text>
                    {product.discount > 0 && (
                      <div className="space-x-2">
                        <Text delete className="text-lg text-gray-500">
                          {formatCurrency(parsedPrice)}
                        </Text>
                        <Tag color="red">Giảm {Math.round(product.discount * 100)}%</Tag>
                      </div>
                    )}
                  </div>
                  <Tag icon={<BarcodeOutlined />} color="blue" className="text-sm">
                    Mã: {product.productCode || product.productCode || 'N/A'}
                  </Tag>
                </div>
              </div>

              {/* Mô tả */}
              <Card
                className="!shadow-sm !border-gray-200"
                bodyStyle={{ padding: '16px' }}
              >
                <Text className="text-gray-700 leading-relaxed">
                  {product.productDescription}
                </Text>
              </Card>

              {/* Specs gọn gàng với Descriptions */}
              <Descriptions
                title="Thông Số Kỹ Thuật"
                bordered
                size="small"
                column={{ xs: 1, sm: 2, lg: 3 }}
                className="!shadow-sm !border-gray-200"
              >
                <Descriptions.Item label={<Space><DropboxOutlined /> Dung lượng</Space>}>
                  {product.productVolume}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><DatabaseOutlined /> Đơn vị</Space>}>
                  {product.productUnit}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><TagOutlined /> Số lượng tồn</Space>}>
                  <Tag color="green">{product.productQuantity}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Space><FolderOutlined /> Danh mục</Space>}>
                  <Tag color="purple">{product.categoryName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Space><UserOutlined /> Nhà cung cấp</Space>}>
                  {product.supplierName}
                </Descriptions.Item>
                <Descriptions.Item label="Màu sắc" span={2}>
                  <Tag color="geekblue">{product.colorName || 'N/A'}</Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* Hệ thống info */}
              <Card
                title={
                  <Space>
                    <CalendarOutlined />
                    <span>Thông Tin Hệ Thống</span>
                  </Space>
                }
                className="!shadow-sm !border-gray-200"
                bodyStyle={{ padding: '16px' }}
              >
                <Descriptions size="small" column={1}>
                  <Descriptions.Item label="ID Sản Phẩm">
                    <Text copyable className="text-sm text-gray-600">
                      {product.productId}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tạo Tại">
                    <Text type="secondary" className="text-sm">
                      {formatDate(product.createAt)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập Nhật Tại">
                    <Text type="secondary" className="text-sm">
                      {formatDate(product.updateAt)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;