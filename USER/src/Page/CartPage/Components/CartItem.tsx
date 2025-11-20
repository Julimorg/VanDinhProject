
import React from 'react';
import { Card, Image, Tag, Space, InputNumber, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../../Utils/utils';

interface Product {
  productPrice: string;
  productQuantity: number;
  productImage: string[];
  productName: string;
  categoryName: string;
  productCode: string;
  productVolume: string;
  productUnit: string;
}

interface CartItemType {
  cartItemId: string;
  product: Product;
}

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const price = parseFloat(item.product.productPrice);
  const total = price * item.product.productQuantity;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Hình ảnh */}
        <div className="flex-shrink-0">
          <Image
            src={item.product.productImage[0]}
            alt={item.product.productName}
            width={140}
            height={140}
            className="rounded-xl object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        </div>

        {/* Nội dung */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                  {item.product.productName}
                </h3>
                <Space size="small" className="mt-2">
                  <Tag color="blue">{item.product.categoryName}</Tag>
                  <Tag>{item.product.productCode}</Tag>
                </Space>
              </div>
              <Popconfirm
                title="Xóa sản phẩm khỏi giỏ hàng?"
                onConfirm={() => onRemove(item.cartItemId)}
                okText="Xóa"
                cancelText="Hủy"
                placement="left"
              >
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </div>

            <p className="text-sm text-gray-600">
              {item.product.productVolume} • {item.product.productUnit}
            </p>
          </div>

          {/* Số lượng & Giá */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <InputNumber
                min={1}
                max={999}
                value={item.product.productQuantity}
                onChange={(value) => value && onQuantityChange(item.cartItemId, value)}
                className="w-28"
                size="large"
              />
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(total)}
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(price)} / {item.product.productUnit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;