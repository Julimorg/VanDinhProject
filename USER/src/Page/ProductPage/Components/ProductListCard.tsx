import React, { useState } from 'react';
import { Card, Button } from '@mui/material';
import { toast } from 'react-toastify';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
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
      ? 'text-red-500'
      : utils.isVeryLowStock
      ? 'text-orange-500'
      : utils.isLowStock
      ? 'text-amber-500'
      : 'text-emerald-600';

  return (
    <Card
      variant="outlined"
      className="group flex overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:border-gray-300"
      sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Image Section */}
      <div className="relative bg-gray-50 w-52 flex-shrink-0 md:w-56">
        <ImageSwiper
          images={product.productImage}
          productName={product.productName}
          className="h-full min-h-[10rem]"
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
            <span className="text-gray-900 text-sm font-semibold">Tạm hết hàng</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 leading-snug">
              {product.productName}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-900/80 text-white shadow-sm whitespace-nowrap">
              Màu: {product.colorName}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
            {product.supplierName} · {product.categoryName}
          </p>

          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
            Mã: <span className="font-medium text-gray-500">{product.productCode}</span> · {product.productVolume}{' '}
            {product.productUnit}
          </p>

          <div className="flex items-baseline justify-between mt-2.5">
            <div>
              <span className="text-lg md:text-xl font-bold text-gray-900">
                {utils.formattedPrice}
              </span>
              <span className="text-[11px] text-gray-500 ml-1">
                / {product.productVolume} {product.productUnit}
              </span>
            </div>
            <div className={`text-[11px] font-semibold ${stockToneClass} text-right`}>
              {utils.stockDisplayText}
            </div>
          </div>

          {!utils.isOutOfStock && (
            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
              {utils.availabilityMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
          {/* Quantity Selector */}
          {utils.canAddToCart ? (
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-50">
              <button
                onClick={() => handleQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RemoveRoundedIcon sx={{ fontSize: 12 }} />
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
                <AddRoundedIcon sx={{ fontSize: 12 }} />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<VisibilityRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onViewDetail(product.productId)}
              className="h-9 font-medium text-xs"
              sx={{ borderColor: 'stone.300', '&:hover': { borderColor: 'stone.400', bgcolor: 'stone.50' } }}
            >
              Chi tiết
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShoppingCartRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onAddToCart(product, quantity)}
              disabled={!utils.canAddToCart}
              className="h-9 font-semibold text-xs"
            >
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductListCard;
