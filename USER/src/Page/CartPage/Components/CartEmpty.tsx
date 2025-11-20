
import React from 'react';
import { Empty, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CartEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800 mb-2">Giỏ hàng trống</p>
            <p className="text-gray-600">Hãy thêm sản phẩm bạn thích vào giỏ hàng nhé!</p>
          </div>
        }
      >
        <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={() => navigate('/products')}
        >
          Tiếp tục mua sắm
        </Button>
      </Empty>
    </div>
  );
};

export default CartEmpty;