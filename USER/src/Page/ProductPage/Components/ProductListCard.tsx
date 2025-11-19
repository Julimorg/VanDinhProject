import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ImageSwiper from './ImageSwiper';
import type { IGetAllProductResponse } from '../../../Interface/Product/IGetAllProducts';
import { useProductCardUtils } from '../../../Hook/useProductCardUltis';

interface ProductListCardProps {
  product: IGetAllProductResponse;
  onViewDetail: (id: string) => void;
  onAddToCart: (product: IGetAllProductResponse, quantity: number) => void;
}

const ProductListCard: React.FC<ProductListCardProps> = ({ product, onViewDetail, onAddToCart }) => {
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
      className="overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-300"
      bodyStyle={{ padding: 0 }}
      style={{ boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-52 lg:w-56 flex-shrink-0 bg-gray-50">
          <ImageSwiper 
            images={product.productImage} 
            productName={product.productName} 
            className="aspect-square md:aspect-auto md:h-52 lg:h-56" 
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
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 lg:p-5 flex flex-col justify-between bg-white">
          {/* Product Info */}
          <div className="mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
              {product.productName}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {product.productCode}
              </span>
              <span className="text-gray-400">•</span>
              <span>{product.supplierName}</span>
            </div>
          </div>

          {/* Price & Actions Section */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Price & Stock */}
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {utils.formattedPrice}
              </div>
              {utils.canAddToCart && (
                <p className="text-xs text-gray-600">
                  {utils.stockDisplayText}
                </p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector */}
              {utils.canAddToCart && (
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 font-medium mr-2 whitespace-nowrap">SL:</span>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => handleQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusOutlined className="text-xs" />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => handleQuantity(parseInt(e.target.value) || 1)}
                      className="w-10 h-8 text-center font-semibold text-sm focus:outline-none bg-white"
                    />
                    <button
                      onClick={() => handleQuantity(quantity + 1)}
                      disabled={quantity >= utils.maxOrderQuantity}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <PlusOutlined className="text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetail(product.productId)}
                  className="flex-1 sm:flex-none h-9 px-4 font-medium border-gray-300 hover:border-gray-400"
                >
                  Chi tiết
                </Button>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={!utils.canAddToCart}
                  className="flex-1 sm:flex-none h-9 px-4 font-medium bg-gray-900 hover:bg-gray-800 border-0 disabled:bg-gray-300"
                >
                  Thêm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductListCard;