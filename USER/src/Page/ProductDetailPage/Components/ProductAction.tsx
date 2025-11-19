
import React from 'react';
import { Button, Alert } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, AlertOutlined } from '@ant-design/icons';

interface ProductActionsProps {
  quantity: number;
  setQuantity: (q: number) => void;
  productQuantity: number;
  isOutOfStock: boolean;
  onAddToCart: () => void;
  isPending: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  quantity,
  setQuantity,
  productQuantity,
  isOutOfStock,
  onAddToCart,
  isPending,
}) => {
  const isLowStock = productQuantity > 0 && productQuantity <= 10;

  return (
    <div className="mt-10 space-y-6">

      {!isOutOfStock && (
        <div className="flex items-center gap-5">
          <span className="text-base font-medium text-gray-700 min-w-24">Số lượng:</span>

          <div className="flex items-center border border-gray-300 rounded-xl shadow-sm">
            <Button
              type="text"
              size="large"
              icon={<MinusOutlined />}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-12 w-12 hover:bg-gray-50 disabled:opacity-50"
            />

            <span className="w-20 text-center font-bold text-lg text-gray-900">
              {quantity}
            </span>

            <Button
              type="text"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setQuantity(Math.min(productQuantity, quantity + 1))}
              disabled={quantity >= productQuantity}
              className="h-12 w-12 hover:bg-gray-50 disabled:opacity-50"
            />
          </div>

          <span className="text-sm text-gray-500">
            Còn lại: <strong>{productQuantity}</strong>
          </span>
        </div>
      )}

      <Button
        type="primary"
        size="large"
        block
        icon={<ShoppingCartOutlined />}
        onClick={onAddToCart}
        disabled={isOutOfStock}
        loading={isPending}
        className="h-14 text-lg font-semibold rounded-2xl shadow-lg"
        style={{
          backgroundColor: '#000000',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
      </Button>


      {isLowStock && !isOutOfStock && (
        <Alert
          type="warning"
          showIcon
          icon={<AlertOutlined />}
          message={
            <span className="font-medium">
              Chỉ còn <span className="text-red-600 font-bold text-xl">{productQuantity}</span> sản phẩm – Đặt ngay!
            </span>
          }
          className="rounded-xl border-l-4 border-orange-500 bg-orange-50 py-3"
        />
      )}
    </div>
  );
};

export default ProductActions;