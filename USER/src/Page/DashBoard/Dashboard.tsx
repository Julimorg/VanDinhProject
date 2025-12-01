import React from 'react';
import { Row, Col, Card, Carousel, Typography, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  isNew: boolean;
}

// Mock data sản phẩm sơn mới
const newProducts: Product[] = [
  {
    id: 1,
    name: 'Sơn Dulux Weathershield',
    price: '250.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=Dulux+Weathershield', 
    description: 'Sơn ngoại thất chống thấm cao cấp',
    isNew: true,
  },
  {
    id: 2,
    name: 'Sơn Jotun Majestic',
    price: '180.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=Jotun+Majestic',
    description: 'Sơn nội thất bóng mịn, dễ lau chùi',
    isNew: true,
  },
  {
    id: 3,
    name: 'Sơn Nippon Vinilex',
    price: '150.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=Nippon+Vinilex',
    description: 'Sơn đa năng cho tường và trần',
    isNew: true,
  },
  {
    id: 4,
    name: 'Sơn Kova CT-11A',
    price: '120.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=Kova+CT-11A',
    description: 'Sơn chống kiềm hóa giá rẻ',
    isNew: true,
  },
  {
    id: 5,
    name: 'Sơn 911 Maxima',
    price: '200.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=911+Maxima',
    description: 'Sơn cao cấp chống nấm mốc',
    isNew: true,
  },
  {
    id: 6,
    name: 'Sơn TOA 2222',
    price: '160.000 ₫',
    image: 'https://via.placeholder.com/300x200?text=TOA+2222',
    description: 'Sơn bóng cao cấp cho nội thất',
    isNew: true,
  },
];

// Component ProductCard
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card
      hoverable
      cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
      className="h-full transition-all duration-300 hover:shadow-lg"
    >
      {product.isNew && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">Mới</div>}
      <Card.Meta
        title={<Text strong className="text-lg">{product.name}</Text>}
        description={<Text type="secondary" className="text-sm line-clamp-2">{product.description}</Text>}
      />
      <div className="flex justify-between items-center mt-2">
        <Text strong className="text-xl text-green-600">{product.price}</Text>
        <div className="flex gap-1">
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => { /* Xem chi tiết */ }} />
          <Button type="link" icon={<ShoppingCartOutlined />} size="small" onClick={() => { /* Thêm giỏ */ }} />
        </div>
      </div>
    </Card>
  </Col>
);

// Component BannerCarousel (Swiper mượt mà, to rõ)
const BannerCarousel: React.FC = () => {
  const banners = [
    'https://via.placeholder.com/1200x400?text=Khuyến+mãi+Sơn+Dulux+-+Giảm+20%', // Banner 1
    'https://via.placeholder.com/1200x400?text=Sản+phẩm+Mới+Nhất+2025', // Banner 2
    'https://via.placeholder.com/1200x400?text=Nhà+Cung+Cấp+Uy+Tín', // Banner 3
  ];

  return (
    <div className="w-full mb-8">
      <Carousel
        autoplay
        dots={true}
        pauseOnDotsHover
        effect="fade"
        className="rounded-xl overflow-hidden shadow-lg"
        style={{ height: '400px' }} // To và rõ ràng hơn
      >
        {banners.map((src, index) => (
          <div key={index} className="w-full h-full">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

function Dashboard() {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
     {/* <Header isMobile/> */}
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Tiêu đề */}
      <div className="px-6 py-4 text-center">
        <Title level={2} className="text-3xl font-bold text-gray-800 mb-2">
          Sản phẩm mới
        </Title>
        <Text className="text-gray-600">Khám phá những sản phẩm sơn chất lượng cao nhất</Text>
      </div>

      {/* Grid Sản phẩm New Arrival - Responsive */}
      <Row gutter={[16, 16]} className="px-6 mb-8">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default Dashboard;