// Components/ProductAction.tsx
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
    <div className="space-y-3 sm:space-y-4">
      {!isOutOfStock && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Số lượng:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              type="text"
              icon={<MinusOutlined />}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-9 w-9 hover:bg-gray-50 disabled:opacity-50"
            />
            <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => setQuantity(Math.min(productQuantity, quantity + 1))}
              disabled={quantity >= productQuantity}
              className="h-9 w-9 hover:bg-gray-50 disabled:opacity-50"
            />
          </div>
          <span className="text-xs text-gray-500">
            Còn lại: <strong>{productQuantity}</strong>
          </span>
        </div>
      )}

      <Button
        size="large"
        block
        icon={<ShoppingCartOutlined />}
        onClick={onAddToCart}
        disabled={isOutOfStock}
        loading={isPending}
        className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-bold !rounded-xl !border-0"
        style={{
          backgroundColor: isOutOfStock ? '#e5e7eb' : '#f5b400',
          color: isOutOfStock ? '#9ca3af' : '#1f2937',
        }}
      >
        {isOutOfStock ? 'Hết hàng' : 'Add to Cart'}
      </Button>

      {isLowStock && !isOutOfStock && (
        <Alert
          type="warning"
          showIcon
          icon={<AlertOutlined />}
          message={
            <span className="font-medium text-sm">
              Chỉ còn <span className="text-red-600 font-bold">{productQuantity}</span> sản phẩm – Đặt ngay!
            </span>
          }
          className="rounded-lg border-l-4 border-orange-500 bg-orange-50 py-2"
        />
      )}
    </div>
  );
};

export default ProductActions;