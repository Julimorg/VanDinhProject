import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Image,
  Spin,
  Alert,
  Typography,
  Space,
  Tag,
  Button,
  Tabs,
  Empty,
} from 'antd';
import type { TabsProps } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  ZoomInOutlined,
  ToolOutlined,
  BgColorsOutlined,
  ExperimentOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency, formatToVietnamTime } from '@/Utils/ulti';
import { useGetProductDetail } from './Hook/useGetProductDetail';
import EditProductModal from './Components/EditProductModal';
import ConfirmDeleteModal from './Components/DeleteProductModal';
const { Title, Text, Paragraph } = Typography;

// ---------- Types & helpers ----------

type ExtraSpecValue = string | number | boolean | null;

const TYPE_STYLE_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  PAINT: { label: 'Sơn', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  TOOL: { label: 'Dụng cụ', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  CHEMICAL: { label: 'Hóa chất', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
};

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  PAINT: <BgColorsOutlined />,
  TOOL: <ToolOutlined />,
  CHEMICAL: <ExperimentOutlined />,
};

const renderExtraSpecValue = (value: ExtraSpecValue) => {
  if (value === null || value === undefined || value === '') {
    return <Text type="secondary">N/A</Text>;
  }
  if (typeof value === 'boolean') {
    return value ? (
      <Tag icon={<CheckCircleFilled />} color="success">
        Có
      </Tag>
    ) : (
      <Tag icon={<CloseCircleFilled />} color="default">
        Không
      </Tag>
    );
  }
  return <Text strong className="text-sm">{String(value)}</Text>;
};

const ExtraSpecsList: React.FC<{ data?: Record<string, ExtraSpecValue> | null }> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Empty description="Không có thông số bổ sung" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <Text type="secondary" className="text-sm capitalize">
            {key}
          </Text>
          {renderExtraSpecValue(value)}
        </div>
      ))}
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode; swatchColor?: string }> = ({
  label,
  value,
  swatchColor,
}) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <Text type="secondary" className="text-sm">
      {label}
    </Text>
    <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
      {swatchColor && (
        <span
          className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300"
          style={{ backgroundColor: swatchColor }}
        />
      )}
      {value ?? 'N/A'}
    </span>
  </div>
);

const InfoStack: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="py-2 border-b border-gray-100 last:border-0">
    <Text type="secondary" className="text-xs uppercase tracking-wide">
      {label}
    </Text>
    <div className="text-sm text-gray-800 mt-0.5">{value}</div>
  </div>
);

// ---------- Page ----------

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { data, isLoading, error, refetch } = useGetProductDetail(productId);

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
            message={error ? 'Lỗi tải chi tiết sản phẩm' : 'Sản phẩm không tồn tại'}
            description={
              error
                ? 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.'
                : 'Không tìm thấy thông tin sản phẩm.'
            }
            type={error ? 'error' : 'warning'}
            showIcon
          />
        </div>
      </div>
    );
  }

  const product = data.data;

  const handleBack = () => navigate(-1);
  const handleEdit = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);
  const handleSave = async () => {
    setIsModalVisible(false);
    await refetch();
  };
  const handleThumbnailClick = (index: number) => setActiveImageIndex(index);

  const parsedPrice =
    typeof product.productPrice === 'string' ? parseFloat(product.productPrice) : product.productPrice || 0;
  const discountPrice = parsedPrice * (1 - (product.discount || 0));

  const typeStyle =
    TYPE_STYLE_MAP[product.productType] || {
      label: product.productType,
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
    };

  const activeTypeKey = product.paintDetail ? 'paint' : product.toolDetail ? 'tool' : product.chemicalDetail ? 'chemical' : undefined;

  const tabItems: TabsProps['items'] = [
    {
      key: 'tool',
      disabled: !product.toolDetail,
      label: (
        <span className="flex items-center gap-1">
          <ToolOutlined /> Dụng cụ
        </span>
      ),
      children: (
        <div>
          <Text strong className="text-sm block mb-2">
            Thông số bổ sung
          </Text>
          <ExtraSpecsList data={product.toolDetail?.extraSpecs} />
        </div>
      ),
    },
    {
      key: 'paint',
      disabled: !product.paintDetail,
      label: (
        <span className="flex items-center gap-1">
          <BgColorsOutlined /> Sơn
        </span>
      ),
      children: (
        <div>
          <Text strong className="text-sm block mb-2">
            Thông số bổ sung
          </Text>
          <ExtraSpecsList data={product.paintDetail?.extraSpecs} />
        </div>
      ),
    },
    {
      key: 'chemical',
      disabled: !product.chemicalDetail,
      label: (
        <span className="flex items-center gap-1">
          <ExperimentOutlined /> Hóa chất
        </span>
      ),
      children: (
        <div>
          <Text strong className="text-sm block mb-2">
            Thông số bổ sung
          </Text>
          <ExtraSpecsList data={product.chemicalDetail?.extraSpecs} />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header bar */}
        <div className="mb-4 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex-wrap gap-3">
          <Title level={3} className="!m-0 !text-gray-900">
            Chi Tiết Sản Phẩm
          </Title>
          <Space size="small" wrap>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
            <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => setDeleteModalVisible(true)}>
              Xóa sản phẩm
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Quay lại danh sách
            </Button>
          </Space>
        </div>

        {/* Overview card: ảnh | thông tin chung | tóm tắt */}
        <Card className="!shadow-sm !border-gray-100 mb-4">
          <Row gutter={[24, 24]}>
            {/* Ảnh */}
            <Col xs={24} lg={8}>
              <div className="flex gap-3">
                {product.productImage && product.productImage.length > 1 && (
                  <div className="flex flex-col gap-2">
                    {product.productImage.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleThumbnailClick(idx)}
                        className={`w-14 h-14 rounded-md border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all ${
                          activeImageIndex === idx ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          width={56}
                          height={56}
                          className="object-cover"
                          preview={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex-1">
                  <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={product.productImage?.[activeImageIndex] || 'https://via.placeholder.com/400?text=No+Image'}
                      alt={product.productName}
                      className="w-full h-full object-contain p-4"
                      preview
                    />
                  </div>
                  <Text type="secondary" className="text-xs flex items-center justify-center gap-1 mt-2">
                    <ZoomInOutlined /> Nhấn vào ảnh để phóng to
                  </Text>
                </div>
              </div>
            </Col>

            {/* Thông tin chung */}
            <Col xs={24} lg={9}>
              <div className="space-y-4 lg:border-l lg:border-gray-100 lg:pl-6">
                <div>
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Tên sản phẩm
                  </Text>
                  <Title level={4} className="!mt-1 !mb-0 !text-gray-900">
                    {product.productName}
                  </Title>
                </div>

                <div>
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Mã sản phẩm
                  </Text>
                  <div className="text-blue-600 font-semibold text-sm mt-1">{product.productCode || 'N/A'}</div>
                </div>

                <div>
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Danh mục
                  </Text>
                  <div className="text-gray-800 text-sm mt-1">{product.categoryName}</div>
                </div>

                <div>
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Nhà cung cấp
                  </Text>
                  <div className="text-blue-600 font-medium text-sm mt-1">{product.supplierName}</div>
                </div>

                {(product.paintDetail || product.colorName) && (
                  <div>
                    <Text type="secondary" className="text-xs uppercase tracking-wide">
                      Màu sắc
                    </Text>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: product.paintDetail?.hexCode || '#ffffff' }}
                      />
                      <span className="text-sm text-gray-800">
                        {product.paintDetail?.colorName || product.colorName}
                      </span>
                      {product.paintDetail?.colorCode && (
                        <Text type="secondary" className="text-xs">
                          (Mã: {product.paintDetail.colorCode})
                        </Text>
                      )}
                    </div>
                  </div>
                )}

                {product.productDescription && (
                  <div>
                    <Text type="secondary" className="text-xs uppercase tracking-wide">
                      Mô tả sản phẩm
                    </Text>
                    <Paragraph
                      className="!mt-1 !mb-0 text-sm text-gray-600"
                      ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}
                    >
                      {product.productDescription}
                    </Paragraph>
                  </div>
                )}
              </div>
            </Col>

            {/* Tóm tắt giá / loại */}
            <Col xs={24} lg={7}>
              <div className="space-y-3 lg:border-l lg:border-gray-100 lg:pl-6">
                <div>
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Loại sản phẩm
                  </Text>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                    >
                      {TYPE_ICON_MAP[product.productType]} {typeStyle.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <Text type="secondary" className="text-xs uppercase tracking-wide">
                      Dung lượng
                    </Text>
                    <div className="text-sm font-medium text-gray-800 mt-1">{product.productVolume}</div>
                  </div>
                  <div>
                    <Text type="secondary" className="text-xs uppercase tracking-wide">
                      Đơn vị
                    </Text>
                    <div className="text-sm font-medium text-gray-800 mt-1">{product.productUnit}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Số lượng tồn kho
                  </Text>
                  <div className="mt-1">
                    <span className={`text-lg font-bold ${product.productQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.productQuantity}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{product.productUnit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Giá gốc
                  </Text>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{formatCurrency(parsedPrice)}</div>
                </div>

                {product.discount > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <Text type="secondary" className="text-xs uppercase tracking-wide">
                      Giảm giá
                    </Text>
                    <div className="mt-1">
                      <span className="text-red-500 font-semibold text-sm">
                        {Math.round(product.discount * 100)}%
                      </span>
                      <div className="text-xs text-gray-400">
                        (Tiết kiệm {formatCurrency(parsedPrice - discountPrice)})
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                  <Text type="secondary" className="text-xs uppercase tracking-wide">
                    Giá cuối cùng
                  </Text>
                  <div className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(discountPrice)}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Bottom row: thông tin bổ sung | chi tiết loại | tabs thông số */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            <Card size="small" title="Thông tin bổ sung" className="!border-gray-100 h-full">
              <InfoStack
                label="Mã ID sản phẩm"
                value={
                  <Text copyable className="text-sm">
                    {product.productId}
                  </Text>
                }
              />
              <InfoStack label="Ngày tạo" value={formatToVietnamTime(product.createAt)} />
              <InfoStack label="Cập nhật lúc" value={formatToVietnamTime(product.updateAt)} />
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card
              size="small"
              className="!border-gray-100 h-full"
              title={
                <Space size={6}>
                  {TYPE_ICON_MAP[product.productType]}
                  <span>Chi tiết {typeStyle.label}</span>
                </Space>
              }
              extra={<Tag color="success">Thông tin chính</Tag>}
            >
              {product.paintDetail && (
                <>
                  <DetailRow label="ID màu" value={product.paintDetail.colorId} />
                  <DetailRow label="Tên màu" value={product.paintDetail.colorName} />
                  <DetailRow label="Mã màu" value={product.paintDetail.colorCode} />
                  <DetailRow
                    label="Mã HEX"
                    value={product.paintDetail.hexCode}
                    swatchColor={product.paintDetail.hexCode}
                  />
                  <DetailRow label="Bề mặt" value={product.paintDetail.surfaceType} />
                  <DetailRow label="Dung tích" value={product.paintDetail.volume} />
                </>
              )}
              {product.toolDetail && (
                <>
                  <DetailRow label="Loại dụng cụ" value={String(product.toolDetail.toolType)} />
                  <DetailRow label="Dung tích / Kích thước" value={product.toolDetail.volume} />
                </>
              )}
              {product.chemicalDetail && (
                <>
                  <DetailRow label="Loại hóa chất" value={String(product.chemicalDetail.chemicalType)} />
                  <DetailRow label="Dung tích" value={product.chemicalDetail.volume} />
                </>
              )}
              {!product.paintDetail && !product.toolDetail && !product.chemicalDetail && (
                <Empty description="Chưa có thông tin chi tiết" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card size="small" className="!border-gray-100 h-full" title="Thông số theo loại">
              <Tabs defaultActiveKey={activeTypeKey} items={tabItems} size="small" />
            </Card>
          </Col>
        </Row>
      </div>

      <EditProductModal visible={isModalVisible} product={product} onCancel={handleModalClose} onSave={handleSave} />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        productId={product.productId}
        productName={product.productName}
        onSuccess={() => navigate('/products')}
      />
    </div>
  );
};

export default ProductDetailPage;