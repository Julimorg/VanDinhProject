import React from 'react';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
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
    onSuccess: () => {
      toast.success('Đơn hàng đã được xác nhận thành công!');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    },
    onError: (error) => {
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
        variant="contained"
        size="large"
        fullWidth
        type="button"
        loading={mutation.isPending}
        disabled={isSubmitting || mutation.isPending}
        onClick={handleClick}
        className="h-14 text-lg font-semibold rounded-xl shadow-lg"
        sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
      >
        {mutation.isPending ? 'Đang xử lý...' : 'HOÀN TẤT THANH TOÁN'}
      </Button>

      {isSubmitting && mutation.isPending && (
        <Box className="text-center mt-4" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={24} />
          <Typography variant="caption" color="text.secondary">
            Đang xác nhận đơn hàng...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ConfirmPaymentButton;
