// Components/ProductInfoHeader.tsx
import React from 'react';
import { Typography, Tag, Divider } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../../Utils/utils';

const { Title, Text } = Typography;

interface ProductInfoHeaderProps {
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

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <Text type="secondary" className="text-sm sm:text-base">
      {label}
    </Text>
    <span className="text-sm sm:text-base font-medium text-gray-800 text-right">{value}</span>
  </div>
);

const ProductInfoHeader: React.FC<ProductInfoHeaderProps> = ({
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
  const isOutOfStock = productQuantity === 0;
  const isLowStock = productQuantity > 0 && productQuantity <= 10;
  const hasDiscount = !!discount && discount > 0;
  const finalPrice = hasDiscount ? productPrice * (1 - (discount as number)) : productPrice;

  return (
    <div className="space-y-4 sm:space-y-6">
      {categoryName && (
        <Tag color="purple" className="!text-xs sm:!text-sm !px-3 !py-1 !font-semibold uppercase">
          {categoryName}
        </Tag>
      )}

      <div>
        <Title level={1} className="!text-2xl sm:!text-3xl lg:!text-4xl xl:!text-5xl !font-extrabold !text-gray-900 !leading-tight !m-0">
          {productName}
        </Title>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm sm:text-base text-gray-600">
          <span>
            Nhà cung cấp: <span className="text-blue-600 font-medium">{supplierName}</span>
          </span>
          {productCode && (
            <>
              <span className="text-gray-300">|</span>
              <span>
                SKU: <span className="font-medium text-gray-800">{productCode}</span>
              </span>
            </>
          )}
          {soldCount !== undefined && (
            <>
              <span className="text-gray-300">|</span>
              <span>Đã bán: {soldCount}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <Title level={2} className="!text-3xl sm:!text-4xl lg:!text-5xl !font-extrabold !text-red-600 !m-0">
          {formatCurrency(finalPrice)}
        </Title>

        {hasDiscount && (
          <>
            <Text delete className="text-base sm:text-lg text-gray-400">
              {formatCurrency(productPrice)}
            </Text>
            <Tag color="red" className="!text-sm sm:!text-base !font-bold">
              -{Math.round((discount as number) * 100)}%
            </Tag>
          </>
        )}

        {isOutOfStock ? (
          <Tag color="red" className="!text-sm sm:!text-lg !px-4 sm:!px-6 !py-1 sm:!py-2 !font-bold">
            Hết hàng
          </Tag>
        ) : isLowStock ? (
          <Tag color="orange" icon={<AlertOutlined />} className="!text-sm sm:!text-lg !px-4 sm:!px-6 !py-1 sm:!py-2 !font-bold">
            Chỉ còn {productQuantity} sản phẩm!
          </Tag>
        ) : (
          <Tag color="green" className="!text-sm sm:!text-lg !px-4 sm:!px-6 !py-1 sm:!py-2 !font-bold">
            Còn hàng
          </Tag>
        )}
      </div>

      {colorName && (
        <div>
          <Text strong className="text-base sm:text-lg block mb-2 sm:mb-3">
            Màu sắc:
          </Text>
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-4 border-gray-300 shadow-xl flex-shrink-0"
              style={{ backgroundColor: colorCode && /^#[0-9A-Fa-f]{6}$/i.test(colorCode) ? colorCode : '#ccc' }}
            />
            <span className="text-base sm:text-xl font-medium text-gray-800">{colorName}</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white px-4 py-1">
        {productVolume && <InfoRow label="Dung tích" value={productVolume} />}
        {productUnit && <InfoRow label="Đơn vị" value={productUnit} />}
        {productCode && <InfoRow label="Mã sản phẩm" value={productCode} />}
        {categoryName && <InfoRow label="Danh mục" value={categoryName} />}
        <InfoRow
          label="Tồn kho"
          value={
            <span className={isOutOfStock ? 'text-red-500' : 'text-green-600'}>
              {productQuantity}
            </span>
          }
        />
      </div>

      <Divider className="!my-4 sm:!my-8" />
    </div>
  );
};

export default ProductInfoHeader;