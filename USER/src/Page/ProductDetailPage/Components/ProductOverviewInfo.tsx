// Components/ProductOverviewInfo.tsx
import React from 'react';
import { Typography, Chip } from '@mui/material';
import { formatCurrency } from '../../../Utils/utils';

interface ProductOverviewInfoProps {
  productName: string;
  supplierName: string;
  productPrice: number;
  productQuantity: number;
  productCode?: string;
  categoryName?: string;
  productVolume?: string;
  productUnit?: string;
  discount?: number;
  soldCount?: number;
  colorName?: string;
  colorCode?: string;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <Typography color="text.secondary" className="text-sm">
      {label}
    </Typography>
    <span className="text-sm font-medium text-gray-800 text-right">{value ?? 'N/A'}</span>
  </div>
);

const ProductOverviewInfo: React.FC<ProductOverviewInfoProps> = ({
  productName,
  supplierName,
  productPrice,
  productQuantity,
  productCode,
  categoryName,
  productVolume,
  productUnit,
  discount,
  soldCount,
  colorName,
  colorCode,
}) => {
  const hasDiscount = !!discount && discount > 0;
  const finalPrice = hasDiscount ? productPrice * (1 - (discount as number)) : productPrice;
  const savedAmount = productPrice - finalPrice;
  // Giả định: coi là "best seller" nếu bán > 100 — chưa xác nhận field/ngưỡng thật từ BE
  const isBestSeller = (soldCount ?? 0) > 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {isBestSeller && (
          <Chip
            label="BEST SELLER"
            size="small"
            sx={{ bgcolor: '#f97316', color: 'white', fontWeight: 600, fontSize: '0.75rem' }}
          />
        )}
        {categoryName && (
          <Chip
            label={categoryName.toUpperCase()}
            size="small"
            sx={{ bgcolor: 'grey.50', color: 'grey.700', border: '1px solid', borderColor: 'grey.200', fontWeight: 600, fontSize: '0.75rem' }}
          />
        )}
      </div>

      {/* Title */}
      <Typography variant="h5" className="!font-bold !text-gray-900 !leading-snug">
        {productName}
      </Typography>

      {/* Brand / SKU / Sold */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500">
        <span>
          Brand: <span className="text-blue-600 font-medium">{supplierName}</span>
        </span>
        {productCode && (
          <>
            <span>|</span>
            <span>
              SKU: <span className="font-medium text-gray-700">{productCode}</span>
            </span>
          </>
        )}
        {soldCount !== undefined && (
          <>
            <span>|</span>
            <span>Sold: {soldCount}</span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-red-600">{formatCurrency(finalPrice)}</span>
        {hasDiscount && (
          <>
            <Typography component="span" className="text-sm sm:text-base text-gray-400" sx={{ textDecoration: 'line-through' }}>
              {formatCurrency(productPrice)}
            </Typography>
            <Chip label={`-${Math.round((discount as number) * 100)}%`} size="small" color="error" sx={{ fontWeight: 700 }} />
          </>
        )}
      </div>
      {hasDiscount && (
        <Typography color="error" className="text-xs sm:text-sm block -mt-2">
          (You save {formatCurrency(savedAmount)})
        </Typography>
      )}

      {/* Info list */}
      <div className="rounded-xl border border-gray-100 px-4 pt-1 mt-3">
        {colorName && <Row label="Color" value={colorName} />}
        {colorCode && <Row label="Color Code" value={colorCode} />}
        {productVolume && <Row label="Volume" value={productVolume} />}
        {productUnit && <Row label="Unit" value={productUnit} />}
        {productCode && <Row label="Product Code" value={productCode} />}
        {categoryName && <Row label="Category" value={categoryName} />}
        <Row
          label="Quantity in stock"
          value={
            <span className={productQuantity > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
              {productQuantity} {productUnit || ''}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default ProductOverviewInfo;
