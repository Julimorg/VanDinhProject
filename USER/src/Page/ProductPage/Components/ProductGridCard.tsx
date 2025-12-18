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

  const stockToneClass =
    utils.isOutOfStock
      ? 'text-red-500'
      : utils.isVeryLowStock
      ? 'text-orange-500'
      : utils.isLowStock
      ? 'text-amber-500'
      : 'text-emerald-600';

  return (
    <Card
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:border-gray-300"
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

        {/* Category / Color Pills */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-gray-800 shadow-sm line-clamp-1 max-w-[9rem]">
            {product.categoryName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-900/80 text-white shadow-sm line-clamp-1 max-w-[9rem]">
            Màu: {product.colorName}
          </span>
        </div>

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
        <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 text-gray-900 leading-snug min-h-[2.25rem]">
          {product.productName}
        </h3>

        {/* Supplier / Category */}
        <p className="text-[11px] text-gray-500 mb-1 line-clamp-1">
          {product.supplierName} · {product.categoryName}
        </p>

        {/* Meta info: code, volume, unit, color */}
        <p className="text-[11px] text-gray-400 mb-2 line-clamp-2">
          Mã: <span className="font-medium text-gray-500">{product.productCode}</span> · {product.productVolume}{' '}
          {product.productUnit} · Màu: {product.colorName}
        </p>

        {/* Price & Stock Info */}
        <div className="flex items-baseline justify-between mb-2.5">
          <div>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              {utils.formattedPrice}
            </span>
            <div className="text-[11px] text-gray-500 mt-0.5">
              / {product.productVolume} {product.productUnit}
            </div>
          </div>
          <div className={`text-[11px] font-semibold ${stockToneClass} text-right`}>
            {utils.stockDisplayText}
          </div>
        </div>

        {/* Availability helper text */}
        {!utils.isOutOfStock && (
          <div className="mb-2">
            <p className="text-[11px] text-gray-500 line-clamp-2">
              {utils.availabilityMessage}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3"></div>

        {/* Quantity Selector & Add to Cart */}
        <div className="mt-auto space-y-2">
          {/* Quantity Selector */}
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

          {/* Action Buttons */}
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
  );
};

export default ProductGridCard;