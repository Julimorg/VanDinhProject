import React from 'react';
import { Card, Button, Divider, Skeleton } from 'antd';
import { toast } from 'react-toastify'; 
import { useCreateOrderFromCart } from '../Hook/useCreateOrderFromCart';
import { useNavigate } from 'react-router-dom'; 

interface OrderSummaryProps {
  isLoading: boolean;
  total: number;
  totalQuantity: number;
  formatCurrency: (amount: number) => string;
  userId: string; 
  cartId: string; 
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  isLoading,
  total,
  totalQuantity,
  formatCurrency,
  userId,
  cartId,
}) => {
  const navigate = useNavigate(); 


  const createOrderMutation = useCreateOrderFromCart(userId, cartId, {
    onSuccess: (response) => {
      toast.success('Tạo đơn hàng thành công! Mã đơn: ' + response.data.orderCode);
      navigate(`/transaction/${response.data.orderId}`);
    },
    onError: (error) => {
      toast.error('Tạo đơn hàng thất bại: ' + (error.message || 'Lỗi không xác định'));
    },
  });

  const handleCheckout = () => {
    if (totalQuantity === 0 || total <= 0) {
      toast.warning('Giỏ hàng của bạn đang trống!');
      return;
    }
    createOrderMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card className="sticky top-4">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính ({totalQuantity} sản phẩm):</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span className="text-green-600">Miễn phí</span>
          </div>
          <Divider className="my-3" />
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button 
          type="primary" 
          size="large" 
          block 
          className="mb-3"
          loading={createOrderMutation.isPending} 
          onClick={handleCheckout}
        >
          Tiến hành thanh toán
        </Button>

        <Button size="large" block>
          Tiếp tục mua sắm
        </Button>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">🎉 Miễn phí vận chuyển cho đơn hàng trên 500.000đ</p>
        </div>
      </Card>
    </div>
  );
};

export default OrderSummary;