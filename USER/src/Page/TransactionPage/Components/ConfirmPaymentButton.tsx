
import React from 'react';
import { Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useConfirmOrder } from '../Hook/useConfirmOrder';


interface ConfirmPaymentButtonProps {
  userId: string;
  orderId: string;
  paymentMethod: string;
  shipAddress: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const ConfirmPaymentButton: React.FC<ConfirmPaymentButtonProps> = ({
  userId,
  orderId,
  paymentMethod,
  shipAddress,
  isSubmitting,
  setIsSubmitting,
}) => {
  const navigate = useNavigate();

  const mutation = useConfirmOrder(userId, orderId, {
    onSuccess: (response) => {
      const data = response.data;

      if (paymentMethod === 'VN_PAY' && data.paymentUrl) {
        toast.success('Đang chuyển hướng đến cổng thanh toán VNPAY...');
        
        window.location.href = data.paymentUrl;
      } else {
 
        toast.success('Đơn hàng đã được xác nhận thành công!');
        setTimeout(() => {
          navigate('/products'); 
        }, 1500);
      }
    },
    onError: (error) => {
    //   console.error('Xác nhận đơn hàng thất bại:', error);
      toast.error(`Thanh toán thất bại, vui lòng thử lại - ${error}`);
      setIsSubmitting(false);
    },
  });

  const handleClick = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    mutation.mutate({
      paymentMethod,
      shipAddress,
    });
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        block
        htmlType="button"
        loading={mutation.isPending}
        disabled={isSubmitting || mutation.isPending}
        onClick={handleClick}
        className="h-14 text-lg font-semibold rounded-xl shadow-lg"
        style={{ backgroundColor: '#4f46e5', border: 'none' }}
      >
        {mutation.isPending ? 'Đang xử lý...' : 'HOÀN TẤT THANH TOÁN'}
      </Button>

      {isSubmitting && mutation.isPending && (
        <div className="text-center mt-4">
          <Spin tip="Đang xác nhận đơn hàng..." />
        </div>
      )}
    </>
  );
};

export default ConfirmPaymentButton;