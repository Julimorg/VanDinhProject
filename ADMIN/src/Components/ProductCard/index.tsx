import React from 'react';
import { Icons } from '@/Components/Icons';

interface ProductCardProps {
  imageUrl?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  oldPrice: number;
  newPrice?: number;
  discountpercen?: number;
  onAdd?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  icon,
  title,
  description,
  oldPrice,
  newPrice,
  discountpercen,
  onAdd,
}) => {
  return (
    <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-3 w-[36rem] h-[150px] bg-white mt-[5px]">
      <div className="w-[120px] h-[120px] flex items-center justify-center">
        {icon ? (
          icon
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={title ?? 'product image'}
            className="object-cover w-full h-full rounded-md"
          />
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 overflow-hidden">
        <div className="flex items-center justify-between w-full">
          <div className="text-2xl font-semibold text-gray-800 line-clamp-1">{title}</div>
          <div className="flex flex-col items-center gap-2">
            {discountpercen && discountpercen > 0 && (
              <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full whitespace-nowrap">
                Giảm {discountpercen}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center gap-4">
            {newPrice && newPrice < oldPrice ? (
              <>
                <p className="text-xl font-bold text-gray-400 line-through">
                  {oldPrice.toLocaleString('vi-VN')}₫
                </p>
                <p className="text-xl font-semibold text-green-600">
                  {newPrice.toLocaleString('vi-VN')}₫
                </p>
              </>
            ) : (
              <p className="text-xl font-semibold text-green-600">
                {oldPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center justify-center transition bg-green-500 rounded-full w-14 h-14 hover:bg-green-600"
            >
              <Icons.PlusProduct className="text-[2rem] text-white" />
            </button>
          )}
        </div>
        <div className="text-base text-gray-600 line-clamp-1">{description}</div>
      </div>
    </div>
  );
};

export default ProductCard;
