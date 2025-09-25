import React from 'react';

import { Icons } from '@/Components/Icons';

interface ComboCardProps {
  className?: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  oldPrice: number;
  newPrice: number;
  discountpercen?: number;
  onAdd?: () => void;
}

const ComboCard: React.FC<ComboCardProps> = ({
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
    <div className="border rounded-lg p-3 flex flex-col justify-between relative shadow-sm bg-white  w-[36rem] h-[20rem]">
      <div className="flex items-start justify-between mb-2">
        <p className="text-2xl font-semibold text-gray-800">{title}</p>

        {discountpercen && discountpercen > 0 && (
          <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full">
            Giảm {discountpercen}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-center w-full h-[7rem] mb-2 overflow-hidden rounded-md bg-gray-50">
        {icon ? (
          icon
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={title || 'combo image'}
            width={600}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div className="text-xs text-gray-400">No image</div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 mt-auto">
        <div className="flex items-start flex-1">
          {description && (
            <p className="text-[1.5rem] text-gray-600 leading-snug line-clamp-2">{description}</p>
          )}
        </div>

        <div className="flex flex-col items-end justify-between h-full">
          <div className="mb-2 text-right">
            {newPrice && newPrice < oldPrice ? (
              <>
                <p className="text-xl font-bold text-gray-400 line-through">
                  {oldPrice.toLocaleString('vi-VN')}₫
                </p>
                <p className="text-xl font-bold text-green-600">
                  {newPrice.toLocaleString('vi-VN')}₫
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-green-600">
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
      </div>
    </div>
  );
};

export default ComboCard;
