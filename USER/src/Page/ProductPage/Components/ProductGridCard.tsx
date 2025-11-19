import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ImageSwiper from './ImageSwiper';
import type { IGetAllProductResponse } from '../../../Interface/Product/IGetAllProducts';
import { useProductCardUtils } from '../../../Hook/useProductCardUltis';


interface ProductGridCardProps {
  product: IGetAllProductResponse;
  onViewDetail: (id: string) => void;
  onAddToCart: (product: IGetAllProductResponse, quantity: number) => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({ product, onViewDetail, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  const utils = useProductCardUtils(product);

  const handleQuantity = (value: number) => {
    const result = utils.validateQuantity(value);
    setQuantity(result.value);
    
    if (result.warning) {
      message.warning(result.warning);
    }
  };

  return (
    <Card
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-300"
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      style={{ boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Image Section */}
      <div className="relative bg-gray-50">
        <ImageSwiper
          images={product.productImage}
          productName={product.productName}
          className="h-56"
        />
        
        {/* Stock Badge */}
        {utils.stockBadge && (
          <div className={`absolute top-2 left-2 ${utils.stockBadge.className}`}>
            {utils.stockBadge.text}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {utils.isOutOfStock && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
            <span className="text-gray-900 text-base font-semibold">Tạm hết hàng</span>
          </div>
        )}

        {/* Quick View Button (appears on hover) */}
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

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-1 bg-white">
        {/* Product Name */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900 leading-snug min-h-[2.25rem]">
          {product.productName}
        </h3>

        {/* Price & Stock Info */}
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">
            {utils.formattedPrice}
          </span>
          <div className="text-xs text-gray-500">
            {utils.canAddToCart && (
              <span>
                Còn <span className="font-semibold text-gray-700">{product.productQuantity}</span>
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3"></div>

        {/* Quantity Selector & Add to Cart */}
        <div className="mt-auto space-y-2">
          {/* Quantity Selector */}
          {utils.canAddToCart && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-600 font-medium">SL:</span>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => handleQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <MinusOutlined className="text-xs" />
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => handleQuantity(parseInt(e.target.value) || 1)}
                  className="w-10 h-7 text-center font-semibold text-xs focus:outline-none bg-white"
                />
                <button
                  onClick={() => handleQuantity(quantity + 1)}
                  disabled={quantity >= utils.maxOrderQuantity}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusOutlined className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(product.productId)}
              className="flex-1 h-9 font-medium text-xs border-gray-300 hover:border-gray-400"
            >
              Chi tiết
            </Button>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => onAddToCart(product, quantity)}
              disabled={!utils.canAddToCart}
              className="flex-1 h-9 font-medium text-xs bg-gray-900 hover:bg-gray-800 border-0 disabled:bg-gray-300"
            >
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductGridCard;