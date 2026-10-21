import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  Typography,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useParams } from 'react-router-dom';
import { useGetOrderDetail } from '../OrderDetailPage/Hook/useGetOrderDetail';
import ShippingAddressForm from './Components/ShippAddressForm';
import PaymentMethodCard from './Components/PaymentMethod';
import TransactionItemCard from './Components/TransactionItemCard';
import { formatCurrency } from '../../Utils/utils';
import ConfirmPaymentButton from './Components/ConfirmPaymentButton';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const TransactionPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [shipAddress, setShipAddress] = useState('');

  const { orderId } = useParams<{ orderId: string }>();
  const userId = useAuthStore((state) => state.id);

  const { data: orderResponse, isLoading, isError } = useGetOrderDetail(orderId || '');
  const order = orderResponse?.data;

  useEffect(() => {
    if (order) {
      setPaymentMethod(order.paymentMethod === 'VN_PAY' ? 'CASH' : order.paymentMethod || 'CASH');
      setShipAddress(order.shipAddress || order.userAddress || '');
    }
  }, [order]);

  if (isLoading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <CircularProgress size={40} />
        <Typography color="text.secondary">Đang tải thông tin đơn hàng...</Typography>
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-2 text-center px-4">
        <Typography variant="h4" fontWeight={700}>404</Typography>
        <Typography variant="h6">Không tìm thấy đơn hàng</Typography>
        <Typography color="text.secondary">
          Mã đơn hàng không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <Box className="mb-12">
          <Stepper activeStep={1} alternativeLabel>
            <Step>
              <StepLabel StepIconComponent={() => <ShoppingCartRoundedIcon color="success" />}>Giỏ hàng</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconComponent={() => <CreditCardRoundedIcon sx={{ color: '#4f46e5' }} />}>
                Thanh toán &amp; Địa chỉ
              </StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconComponent={() => <CheckCircleRoundedIcon color="disabled" />}>Hoàn tất</StepLabel>
            </Step>
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {/* Cột trái: Thông tin đơn hàng + Sản phẩm */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Header đơn hàng */}
            <Card variant="outlined" className="mb-6 border-0 shadow-sm">
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <Typography variant="h5" className="mb-1 text-gray-800" fontWeight={700}>
                      Đơn hàng{' '}
                      <span className="text-indigo-600 font-bold">#{order.orderCode}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                      <Chip
                        label="Chờ thanh toán"
                        color="info"
                        size="small"
                        icon={<CheckCircleRoundedIcon fontSize="small" />}
                      />
                      <Typography color="text.secondary" variant="body2">
                        Ngày tạo: {new Date(order.createAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  </div>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: '#4f46e5' }}>
                    <ShoppingCartRoundedIcon />
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <TransactionItemCard
              items={order.items}
              totalAmount={order.amount}
              formatCurrency={formatCurrency}
            />
          </Grid>

          {/* Cột phải: Form xác nhận thanh toán */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card variant="outlined" className="shadow-xl border-0 sticky top-6">
              <CardHeader
                title={
                  <Typography variant="h6" className="text-center text-gray-800" fontWeight={700}>
                    Xác nhận thanh toán
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                {/* Thông tin khách hàng nhanh */}
                <Card variant="outlined" className="mb-6 bg-gray-50 border-0">
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonRoundedIcon fontSize="small" sx={{ color: '#4f46e5' }} />
                        <Typography fontWeight={600}>{order.userName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailRoundedIcon fontSize="small" sx={{ color: '#4f46e5' }} />
                        <Typography>{order.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneRoundedIcon fontSize="small" sx={{ color: '#4f46e5' }} />
                        <Typography>{order.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeRoundedIcon fontSize="small" sx={{ color: '#4f46e5' }} />
                        <Typography>{order.shipAddress || order.userAddress}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Form địa chỉ giao hàng */}
                <ShippingAddressForm value={shipAddress} onChange={setShipAddress} />

                {/* Phương thức thanh toán */}
                <PaymentMethodCard value={paymentMethod} onChange={setPaymentMethod} />

                <Divider className="my-6" />

                {/* Nút hoàn tất */}
                <ConfirmPaymentButton
                  userId={userId ?? ''}
                  orderId={orderId!}
                  paymentMethod={paymentMethod}
                  shipAddress={shipAddress}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                />

                <Typography color="text.secondary" className="block text-center mt-4 text-xs" variant="caption">
                  Bằng việc nhấn nút trên, bạn đồng ý với{' '}
                  <a href="/terms" className="text-indigo-600 underline hover:text-indigo-800">
                    điều khoản mua hàng
                  </a>{' '}
                  của chúng tôi.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TransactionPage;
