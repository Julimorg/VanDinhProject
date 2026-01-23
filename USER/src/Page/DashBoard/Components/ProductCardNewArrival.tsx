import React, { useState } from 'react';
import {  Col, Card, Typography, Button, Tag, Rate, message } from 'antd';
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
    <Col xs={12} sm={12} md={8} lg={6} xl={4}>
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full"
        cover={
          <div className="relative overflow-hidden h-56 md:h-64">
            <img
              alt={product.productName}
              src={mainImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Tag color="red" className="text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                MỚI
              </Tag>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                shape="circle"
                icon={<HeartOutlined />}
                className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:bg-red-50"
              />
            </div>

            {utils.stockBadge && (
              <div className={`absolute top-3 left-3 ${utils.stockBadge.className}`}>
                {utils.stockBadge.text}
              </div>
            )}

            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-gray-800 shadow-sm line-clamp-1 max-w-[9rem]">
                {product.categoryName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-900/80 text-white shadow-sm line-clamp-1 max-w-[9rem]">
                Màu: {product.colorName}
              </span>
            </div>

            {utils.isOutOfStock && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
                <span className="text-gray-900 text-base font-semibold">Tạm hết hàng</span>
              </div>
            )}

            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 transition-opacity duration-300 ${
                isHovered && utils.canAddToCart ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(product.productId)}
                block
                size="small"
                className="bg-white/95 hover:bg-white border-0 font-medium"
              >
                Xem nhanh
              </Button>
            </div>
          </div>
        }
        bodyStyle={{ padding: '16px 12px' }}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{product.categoryName || 'Sơn nội thất'}</span>
            <span className="font-mono">{product.productCode}</span>
          </div>

          <Typography.Title level={5} className="text-base md:text-lg font-semibold line-clamp-2 h-12 md:h-14 mb-1">
            {product.productName}
          </Typography.Title>

          <div className="flex items-center gap-2 text-sm">
            {product.colorName && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: product.colorName.toLowerCase().includes('trắng') ? '#fff' : '#e63946',
                  }}
                />
                <span>{product.colorName}</span>
              </div>
            )}
            <Typography.Text type="secondary">• {product.productVolume} {product.productUnit}</Typography.Text>
          </div>

          <div className="flex justify-between items-end mt-3">
            <div>
              <Typography.Text strong className="text-xl md:text-2xl text-green-700 block">
                {formatPrice(product.productPrice)}
              </Typography.Text>
              {product.productQuantity < 10 && product.productQuantity > 0 && (
                <Typography.Text type="danger" className="text-xs">
                  Chỉ còn {product.productQuantity} sản phẩm
                </Typography.Text>
              )}
            </div>

            <Rate disabled defaultValue={4.5} count={5} className="text-sm" />
          </div>

          {!utils.isOutOfStock && (
            <div className="mb-2">
              <p className="text-[11px] text-gray-500 line-clamp-2">
                {utils.availabilityMessage}
              </p>
            </div>
          )}

          <div className="border-t border-gray-100 mb-3"></div>

          <div className="mt-auto space-y-2">
            {utils.canAddToCart && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-50">
                  <button
                    onClick={() => handleQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusOutlined className="text-[10px]" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => handleQuantity(parseInt(e.target.value) || 1)}
                    className="w-10 h-8 text-center font-semibold text-xs focus:outline-none bg-transparent"
                  />
                  <button
                    onClick={() => handleQuantity(quantity + 1)}
                    disabled={quantity >= utils.maxOrderQuantity}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusOutlined className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(product.productId)}
                className="flex-1 h-9 font-medium text-xs border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                Chi tiết
              </Button>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddToCart(product, quantity)}
                disabled={!utils.canAddToCart}
                className="flex-1 h-9 font-semibold text-xs bg-gray-900 hover:bg-gray-800 border-0 disabled:bg-gray-300"
              >
                Thêm vào giỏ
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default ProductCardNewArrival;