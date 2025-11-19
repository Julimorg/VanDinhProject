import React from 'react';
import { Card, InputNumber, Space, Image, Tag, Popconfirm, Button, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface CartItem {
  cartItemId: string;
  product: {
    productName: string;
    productImage: string[];
    categoryName: string;
    productCode: string;
    productVolume: string;
    productUnit: string;
    productPrice: string;
    productQuantity: number;
  };
}

interface CartItemsCardProps {
  localCart: CartItem[];
  isLoading: boolean;
  handleQuantityChange: (cartItemId: string, value: number) => void;
  handleRemoveItem: (cartItemId: string) => void;
  formatCurrency: (amount: number) => string;
}

const CartItemsCard: React.FC<CartItemsCardProps> = ({
  localCart,
  isLoading,
  handleQuantityChange,
  handleRemoveItem,
  formatCurrency,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx}>
            <Skeleton avatar paragraph={{ rows: 3 }} active />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-4">
      {localCart.map((item) => (
        <Card key={item.cartItemId} className="hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <Image
                src={item.product.productImage[0]}
                alt={item.product.productName}
                width={120}
                height={120}
                className="rounded-lg object-cover"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.productName}</h3>
                  <Space size="small" wrap>
                    <Tag color="blue">{item.product.categoryName}</Tag>
                    <Tag>{item.product.productCode}</Tag>
                  </Space>
                </div>
                <Popconfirm
                  title="Xóa sản phẩm"
                  description="Bạn có chắc muốn xóa sản phẩm này?"
                  onConfirm={() => handleRemoveItem(item.cartItemId)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {item.product.productVolume} - {item.product.productUnit}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Số lượng:</span>
                  <InputNumber
                    min={1}
                    max={100}
                    value={item.product.productQuantity}
                    onChange={(value) => handleQuantityChange(item.cartItemId, value!)}
                    className="w-24"
                  />
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(parseFloat(item.product.productPrice) * item.product.productQuantity)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(parseFloat(item.product.productPrice))} / {item.product.productUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CartItemsCard;