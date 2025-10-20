// ProductDetail.tsx
import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Image,
  Row,
  Col,
  Typography,
  Spin,
  Button,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EditProductModal from './Components/EditProductModal';

const { Title, Paragraph } = Typography;

// Interface cho Product
interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number;
  productPrice: string;
  supplierName: string;
  colorName: string;
  categoryName: string;
  createAt: string;
  updateAt: string;
}

// Props cho ProductDetail
interface ProductDetailProps {
  product?: Product;
  onUpdate?: (updatedProduct: Product) => void;
}

// Component chính: ProductDetail
const ProductDetail: React.FC<ProductDetailProps> = ({ product, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // Loading state
  if (!product) {
    return (
      <div className="px-4 py-10 bg-gray-50 flex flex-col items-center min-h-screen">
        <Spin size="large" />
        <Paragraph className="mt-4 text-gray-500">Đang tải chi tiết sản phẩm...</Paragraph>
      </div>
    );
  }

  // Handlers
  const handleEdit = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);
  const handleSave = (updatedProduct: Product) => {
    onUpdate?.(updatedProduct);
    setIsModalVisible(false);
  };
  const handleBack = () => {
    navigate(-1);
  };

  // Render hình ảnh với scroll ngang
  const renderImages = () => (
    <div className="custom-scrollbar flex overflow-x-auto gap-3 pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory">
      {product.productImage.length > 0 ? (
        product.productImage.map((imageUrl, index) => (
          <div key={index} className="min-w-[140px] flex-shrink-0 snap-center">
            <Image
              src={imageUrl}
              alt={`Hình ảnh ${index + 1}`}
              width={140}
              height={140}
              preview={true}
              className="object-cover rounded-2xl shadow-md"
              fallback="https://via.placeholder.com/140x140?text=Không+có+hình+ảnh"
            />
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center py-10 text-gray-400">
          <Image
            src="https://via.placeholder.com/140x140?text=Không+có+hình+ảnh"
            width={140}
            height={140}
            preview={false}
            className="object-cover rounded-2xl"
          />
          <Paragraph className="mt-2 text-gray-400">Chưa có hình ảnh</Paragraph>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen md:px-8 md:py-8 lg:px-8 lg:py-8">
      {/* Header với nút back - Responsive: Stack dọc trên mobile */}
      <Row gutter={[0, 4]} justify="space-between" align="middle" className="mb-6">
        <Col xs={12} sm={8} md={6}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            size="small"
            className="w-full h-8 text-blue-600 border-blue-200 bg-white rounded-lg font-medium hover:bg-blue-50 md:w-auto md:h-9"
          >
            Quay trở về
          </Button>
        </Col>
        <Col xs={24} sm={16} md={12} className="text-center">
          <Title
            level={2}
            className="m-0 text-gray-900 font-semibold leading-tight"
          >
            Chi Tiết Sản Phẩm
          </Title>
        </Col>
        <Col xs={0} md={6} />
      </Row>

      <Row gutter={[4, 6]} className="md:gutter-x-4 md:gutter-y-6 lg:gutter-x-4 lg:gutter-y-6">
        {/* Cột hình ảnh */}
        <Col xs={24} lg={8}>
          <Card
            title="Hình Ảnh Sản Phẩm"
            className="rounded-2xl shadow-sm bg-white border-0"
            bodyStyle={{ padding: '20px' }}
            extra={
              <Button
                type="primary"
                onClick={handleEdit}
                size="small"
                className="bg-blue-500 border-blue-500 hover:bg-blue-600"
              >
                Chỉnh sửa
              </Button>
            }
          >
            {renderImages()}
          </Card>
        </Col>

        {/* Cột thông tin chi tiết */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-500 text-base">Thông Tin Sản Phẩm</span>
                <span className="text-2xl font-bold text-blue-500">
                  {product.productName}
                </span>
              </div>
            }
            className="rounded-2xl shadow-sm bg-white border-0"
            bodyStyle={{ padding: '20px' }}
          >
            {/* Thông tin cơ bản */}
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 2,
                md: 3,
              }}
              size="middle"
              title={<span className="font-bold text-gray-900">Thông Tin Cơ Bản</span>}
              className="mb-6"
              labelStyle={{ fontWeight: '500', color: '#595959' }}
              contentStyle={{ color: '#262626' }}
            >
              <Descriptions.Item label="Mã Sản Phẩm">
                {product.productId}
              </Descriptions.Item>
              <Descriptions.Item label="Mã Code">
                {product.productCode}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Sản Phẩm">
                {product.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Dung Lượng">
                {product.productVolume}
              </Descriptions.Item>
              <Descriptions.Item label="Đơn Vị">
                {product.productUnit}
              </Descriptions.Item>
              <Descriptions.Item label="Số Lượng">
                {product.productQuantity}
              </Descriptions.Item>
              <Descriptions.Item label="Giá Sản Phẩm">
                {parseFloat(product.productPrice).toLocaleString('vi-VN')} VND
              </Descriptions.Item>
              <Descriptions.Item label="Giảm Giá">
                {product.discount * 100}%
              </Descriptions.Item>
            </Descriptions>

            {/* Mô tả sản phẩm */}
            <Card
              title={<span className="font-bold text-gray-900">Mô Tả Sản Phẩm</span>}
              className="mb-6 rounded-2xl shadow-sm bg-gray-50 border-0"
              bodyStyle={{ padding: '20px' }}
            >
              <Paragraph className="whitespace-pre-wrap leading-7 text-gray-700 text-base m-0">
                {product.productDescription || 'Chưa có mô tả chi tiết.'}
              </Paragraph>
            </Card>

            {/* Thông tin khác */}
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 2,
                md: 2,
              }}
              size="small"
              title={<span className="font-bold text-gray-900">Thông Tin Khác</span>}
              labelStyle={{ fontWeight: '500', color: '#595959' }}
              contentStyle={{ color: '#262626' }}
            >
              <Descriptions.Item label="Nhà Cung Cấp">
                {product.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="Màu Sắc">
                {product.colorName}
              </Descriptions.Item>
              <Descriptions.Item label="Danh Mục">
                {product.categoryName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày Tạo">
                {new Date(product.createAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày Cập Nhật">
                {new Date(product.updateAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Modal chỉnh sửa */}
      <EditProductModal
        visible={isModalVisible}
        product={product}
        onCancel={handleModalClose}
        onSave={handleSave}
      />
    </div>
  );
};

// App wrapper để test (có thể xóa khi tích hợp)
const App: React.FC = () => {
  const [product, setProduct] = useState<Product | undefined>(undefined);

  React.useEffect(() => {
    const tempProduct: Product = {
      productId: '783a5d3d-3d80-452e-bbe4-c61447cc300d',
      productName: 'Coca Cola V8',
      productDescription: 'Nước ngọt có gas',
      productImage: [
        'https://res.cloudinary.com/dabbl1kwh/image/upload/v1759667885/imgCoca_Cola_V8_1_2025-10-05.png',
        'https://res.cloudinary.com/dabbl1kwh/image/upload/v1759667886/imgCoca_Cola_V8_2_2025-10-05.png',
        'https://res.cloudinary.com/dabbl1kwh/image/upload/v1759667887/imgCoca_Cola_V8_3_2025-10-05.jpg',
        'https://res.cloudinary.com/dabbl1kwh/image/upload/v1759667889/imgCoca_Cola_V8_4_2025-10-05.png',
      ],
      productVolume: '330ml',
      productUnit: 'Lon',
      productCode: 'Lon',
      productQuantity: 23,
      discount: 0.1,
      productPrice: '132000.00',
      supplierName: 'Bạch Tuyết',
      colorName: 'black',
      categoryName: 'Sách',
      createAt: '2025-10-05T19:38:10.105831',
      updateAt: '2025-10-05T19:38:10.105831',
    };
    setProduct(tempProduct);
  }, []);

  const handleUpdate = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    console.log('Cập nhật sản phẩm:', updatedProduct);
  };

  return <ProductDetail product={product} onUpdate={handleUpdate} />;
};

export default App;