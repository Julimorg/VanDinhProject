import React, { useState } from 'react';
import { Card, Button } from '@mui/material';
import { toast } from 'react-toastify';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
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

  const utils = useProductCardUtils(product);

  const handleQuantity = (value: number) => {
    const result = utils.validateQuantity(value);
    setQuantity(result.value);

    if (result.warning) {
      toast.warning(result.warning);
    }
  };

  const stockToneClass =
    utils.isOutOfStock
      ? 'text-red-600'
      : utils.isVeryLowStock || utils.isLowStock
      ? 'text-amber-600'
      : 'text-stone-600';

  return (
    <Card
      variant="outlined"
      onClick={() => onViewDetail(product.productId)}
      className="group flex overflow-hidden rounded-lg border border-stone-200 bg-white transition-all duration-300 hover:border-stone-900 cursor-pointer"
      sx={{ '&:hover': { boxShadow: '0 16px 32px -14px rgba(0,0,0,0.18)' } }}
    >
      {/* Image Section */}
      <div className="relative bg-stone-50 w-44 sm:w-52 flex-shrink-0 md:w-56 overflow-hidden">
        <ImageSwiper
          images={product.productImage}
          productName={product.productName}
          className="h-full min-h-[9rem] transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Stock Badge */}
        {utils.stockBadge && (
          <div className={`absolute top-2 left-2 ${utils.stockBadge.className}`}>
            {utils.stockBadge.text}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {utils.isOutOfStock && (
          <div className="absolute inset-0 bg-white/92 flex items-center justify-center backdrop-blur-sm">
            <span className="text-stone-900 text-sm font-bold uppercase tracking-wide">Tạm hết hàng</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5 line-clamp-1">
                {product.supplierName} · {product.categoryName}
              </p>
              <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-stone-900 leading-snug">
                {product.productName}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-white text-stone-900 border border-stone-200 shadow-sm whitespace-nowrap flex-shrink-0">
              {product.colorName}
            </span>
          </div>

          <p className="text-[11px] text-stone-400 mt-1.5 line-clamp-1">
            Mã: {product.productCode} · {product.productVolume} {product.productUnit}
          </p>

          <div className="flex items-baseline justify-between mt-2.5">
            <span className="text-lg md:text-xl font-bold text-stone-900">
              {utils.formattedPrice}
            </span>
            <div className={`text-[11px] font-semibold ${stockToneClass} text-right`}>
              {utils.stockDisplayText}
            </div>
          </div>

          {!utils.isOutOfStock && (
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 hidden sm:block">
              {utils.availabilityMessage}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-stone-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quantity Selector */}
          {utils.canAddToCart ? (
            <div className="flex items-center border border-stone-300 rounded-sm overflow-hidden">
              <button
                onClick={() => handleQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RemoveRoundedIcon sx={{ fontSize: 12 }} />
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => handleQuantity(parseInt(e.target.value) || 1)}
                onClick={(e) => e.stopPropagation()}
                className="w-8 sm:w-10 h-7 sm:h-8 text-center font-semibold text-xs focus:outline-none bg-transparent"
              />
              <button
                onClick={() => handleQuantity(quantity + 1)}
                disabled={quantity >= utils.maxOrderQuantity}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <AddRoundedIcon sx={{ fontSize: 12 }} />
              </button>
            </div>
          ) : (
            <div />
          )}

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => onAddToCart(product, quantity)}
            disabled={!utils.canAddToCart}
            className="h-8 sm:h-9 font-semibold text-xs"
            sx={{ borderRadius: '4px' }}
          >
            {utils.canAddToCart ? 'Thêm vào giỏ' : 'Hết hàng'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductListCard;
