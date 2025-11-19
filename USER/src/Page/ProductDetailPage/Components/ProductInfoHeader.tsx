
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
  colorName?: string;
  colorCode?: string;
}

const ProductInfoHeader: React.FC<ProductInfoHeaderProps> = ({
  productName,
  supplierName,
  productPrice,
  productQuantity,
  colorName,
  colorCode,
}) => {
  const isOutOfStock = productQuantity === 0;
  const isLowStock = productQuantity > 0 && productQuantity <= 10;

  return (
    <div className="space-y-6">
      <div>
        <Title level={1} className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          {productName}
        </Title>
        <Text className="text-xl text-gray-600 font-medium mt-2 block">
          Nhà cung cấp: <span className="text-blue-600">{supplierName}</span>
        </Text>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Title level={2} className="text-5xl font-extrabold text-red-600 m-0">
          {formatCurrency(productPrice)}
        </Title>

        {isOutOfStock ? (
          <Tag color="red" className="text-lg px-6 py-2 font-bold">Hết hàng</Tag>
        ) : isLowStock ? (
          <Tag color="orange" icon={<AlertOutlined />} className="text-lg px-6 py-2 font-bold">
            Chỉ còn {productQuantity} sản phẩm!
          </Tag>
        ) : (
          <Tag color="green" className="text-lg px-6 py-2 font-bold">Còn hàng</Tag>
        )}
      </div>

      {colorName && (
        <div>
          <Text strong className="text-lg block mb-3">Màu sắc:</Text>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl border-4 border-gray-300 shadow-xl"
              style={{ backgroundColor: colorCode && /^#[0-9A-Fa-f]{6}$/i.test(colorCode) ? colorCode : '#ccc' }}
            />
            <span className="text-xl font-medium text-gray-800">{colorName}</span>
          </div>
        </div>
      )}

      <Divider className="my-8" />
    </div>
  );
};

export default ProductInfoHeader;