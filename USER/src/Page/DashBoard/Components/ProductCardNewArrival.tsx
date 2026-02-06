import React, { useState } from 'react';
import { Col, Card, Typography, Button, Tag, Rate, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { IGetProductNewArrival } from '../../../Interface/Product/IGetProductNewArrival';
import { useProductCardUtils } from '../../../Hook/useProductCardUltis';

interface ProductCardNewArrivalProps {
  product: IGetProductNewArrival[0];
  onViewDetail: (id: string) => void;
  onAddToCart: (product: IGetProductNewArrival[0], quantity: number) => void;
}

const ProductCardNewArrival: React.FC<ProductCardNewArrivalProps> = ({ product, onViewDetail, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const utils = useProductCardUtils(product);

  const mainImage = product.productImage?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' ₫';

  const handleQuantity = (value: number) => {
    const result = utils.validateQuantity(value);
    setQuantity(result.value);

    if (result.warning) {
      message.warning(result.warning);
    }
  };

  return (
    <Col xs={12} sm={12} md={8} lg={6} xl={4} xxl={3}>
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 h-full flex flex-col"
        bodyStyle={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}
        cover={
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-square">
            <img
              alt={product.productName}
              src={mainImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges top-left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Tag color="red" className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                MỚI
              </Tag>
              {utils.stockBadge && (
                <Tag className={`text-[10px] px-1.5 py-0.5 rounded-full shadow-sm ${utils.stockBadge.className}`}>
                  {utils.stockBadge.text}
                </Tag>
              )}
            </div>

            {/* Wishlist button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                shape="circle"
                icon={<HeartOutlined />}
                size="small"
                className="bg-white/90 backdrop-blur-sm border-none shadow hover:bg-red-50"
              />
            </div>

            {/* Color & Category tags top-right */}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1 opacity-90">
              {product.colorName && (
                <Tag className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/90 text-gray-800 shadow-sm">
                  Màu: {product.colorName}
                </Tag>
              )}
              <Tag className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800/80 text-white shadow-sm">
                {product.categoryName || 'Sơn nội thất'}
              </Tag>
            </div>

            {/* Out of stock overlay */}
            {utils.isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium text-sm">Hết hàng</span>
              </div>
            )}

            {/* Quick view button bottom */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-300 ${
                isHovered && utils.canAddToCart ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(product.productId)}
                block
                className="bg-white/95 hover:bg-white text-black font-medium text-xs"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col flex-1 space-y-1.5">
          {/* Name */}
          <Typography.Title
            level={5}
            className="text-sm md:text-base font-semibold line-clamp-2 mb-0 h-10 md:h-12"
          >
            {product.productName}
          </Typography.Title>

          {/* Code & Volume */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{product.productCode}</span>
            <span>
              {product.productVolume} {product.productUnit}
            </span>
          </div>

          {/* Price & Rating */}
          <div className="flex items-end justify-between mt-1">
            <div>
              <Typography.Text strong className="text-base md:text-lg text-green-700 block">
                {formatPrice(product.productPrice)}
              </Typography.Text>
              {product.productQuantity < 10 && product.productQuantity > 0 && (
                <Typography.Text type="danger" className="text-xs">
                  Còn {product.productQuantity}
                </Typography.Text>
              )}
            </div>
            <Rate disabled defaultValue={4.5} count={5} className="text-xs" />
          </div>

          {/* Quantity selector & Buttons */}
          <div className="mt-auto pt-2 space-y-2">
            {utils.canAddToCart && (
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white text-xs">
                  <button
                    onClick={() => handleQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <MinusOutlined />
                  </button>
                  <span className="px-3 py-1 font-medium min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(quantity + 1)}
                    disabled={quantity >= utils.maxOrderQuantity}
                    className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-1.5">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(product.productId)}
                className="flex-1 text-xs border-gray-300 hover:border-gray-400"
              >
                Chi tiết
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddToCart(product, quantity)}
                disabled={!utils.canAddToCart}
                className="flex-1 text-xs bg-gray-900 hover:bg-gray-800"
              >
                Thêm giỏ
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default ProductCardNewArrival;