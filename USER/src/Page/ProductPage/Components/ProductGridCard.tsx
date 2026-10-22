import React, { useState } from 'react';
import { Card, Button } from '@mui/material';
import { toast } from 'react-toastify';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
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

  const handleQuantity = (e: React.MouseEvent | React.ChangeEvent, value: number) => {
    e.stopPropagation();
    const result = utils.validateQuantity(value);
    setQuantity(result.value);

    if (result.warning) {
      toast.warning(result.warning);
    }
  };

  const stockToneClass =
    utils.isOutOfStock
      ? 'text-red-600'
      : utils.isVeryLowStock
      ? 'text-amber-600'
      : utils.isLowStock
      ? 'text-amber-600'
      : 'text-stone-600';

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetail(product.productId)}
      className="group h-full flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 hover:border-stone-900 cursor-pointer"
      sx={{ boxShadow: isHovered ? '0 16px 32px -12px rgba(0,0,0,0.18)' : 'none' }}
    >
      {/* Image Section */}
      <div className="relative bg-stone-50 overflow-hidden">
        <ImageSwiper
          images={product.productImage}
          productName={product.productName}
          className={`h-60 transition-transform duration-500 ${isHovered ? 'scale-[1.04]' : 'scale-100'}`}
        />

        {/* Stock Badge */}
        {utils.stockBadge && (
          <div className={`absolute top-2.5 left-2.5 ${utils.stockBadge.className}`}>
            {utils.stockBadge.text}
          </div>
        )}

        {/* Color pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-white/95 text-stone-900 border border-stone-200 shadow-sm line-clamp-1 max-w-[7rem]">
            {product.colorName}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {utils.isOutOfStock && (
          <div className="absolute inset-0 bg-white/92 flex items-center justify-center backdrop-blur-sm">
            <span className="text-stone-900 text-sm font-bold uppercase tracking-wide">Tạm hết hàng</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-1 bg-white">
        {/* Supplier / Category label */}
        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1 line-clamp-1">
          {product.supplierName} · {product.categoryName}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 text-stone-900 leading-snug min-h-[2.25rem]">
          {product.productName}
        </h3>

        {/* Meta info: code, volume, unit */}
        <p className="text-[11px] text-stone-400 mb-2.5 line-clamp-1">
          Mã: {product.productCode} · {product.productVolume} {product.productUnit}
        </p>

        {/* Price & Stock Info */}
        <div className="flex items-baseline justify-between mb-2.5 mt-auto">
          <span className="text-lg font-bold text-stone-900">
            {utils.formattedPrice}
          </span>
          <div className={`text-[11px] font-semibold ${stockToneClass} text-right`}>
            {utils.stockDisplayText}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100 mb-2.5" />

        {/* Quantity Selector & Add to Cart */}
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          {utils.canAddToCart && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-sm overflow-hidden">
                <button
                  onClick={(e) => handleQuantity(e, quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <RemoveRoundedIcon sx={{ fontSize: 12 }} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => handleQuantity(e, parseInt(e.target.value) || 1)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-7 text-center font-semibold text-xs focus:outline-none bg-transparent"
                />
                <button
                  onClick={(e) => handleQuantity(e, quantity + 1)}
                  disabled={quantity >= utils.maxOrderQuantity}
                  className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <AddRoundedIcon sx={{ fontSize: 12 }} />
                </button>
              </div>
            </div>
          )}

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, quantity);
            }}
            disabled={!utils.canAddToCart}
            fullWidth
            className="h-9 font-semibold text-xs"
            sx={{ borderRadius: '4px' }}
          >
            {utils.canAddToCart ? 'Thêm vào giỏ' : 'Hết hàng'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductGridCard;
