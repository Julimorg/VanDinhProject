import React from 'react';
import { Button, Divider, Card, CardHeader, CardContent, Alert, Box, CircularProgress } from '@mui/material';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getStatusConfig } from '../OrderHistoryPage/Components/OrderStatusConfig';
import { formatCurrency } from '../../Utils/utils';
import { useGetOrderDetail } from './Hook/useGetOrderDetail';
import OrderItemCard from './Components/OrderItemCard';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetOrderDetail(orderId, {});

  if (isLoading) {
    return (
      <Box className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3">
        <CircularProgress size={40} />
        <p className="text-stone-500">Đang tải chi tiết đơn hàng...</p>
      </Box>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="mb-4">
            {error ? (error as Error).message || 'Không thể tải chi tiết đơn hàng.' : 'Không tìm thấy dữ liệu đơn hàng.'}
          </Alert>
          <Button variant="outlined" onClick={() => navigate('/orders')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const order = data.data;
  const statusConfig = getStatusConfig(order.status.toLowerCase());
  const items = order.items || [];
  const totalFromItems = items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

  return (
    <div className="min-h-screen bg-stone-50 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-b border-stone-200 bg-stone-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Chi tiết đơn hàng</h1>
                <p className="text-sm sm:text-base text-stone-600">{order.orderCode}</p>
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium shadow-sm self-start sm:self-auto"
                style={{
                  color: statusConfig.color,
                  backgroundColor: statusConfig.bgColor,
                  border: `1px solid ${statusConfig.borderColor}`
                }}
              >
                {statusConfig.icon}
                <span>{statusConfig.text}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Thông tin đơn hàng */}
            <Card variant="outlined" className="shadow-sm">
              <CardHeader title={<h3 className="text-base sm:text-lg font-semibold text-stone-700">Thông tin đơn hàng</h3>} />
              <CardContent sx={{ pt: 0 }}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-stone-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">Mã đơn hàng</span>
                    <span className="text-sm sm:text-base font-semibold text-stone-900">{order.orderCode}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-stone-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">ID đơn hàng</span>
                    <span className="text-sm sm:text-base font-medium text-stone-900 truncate max-w-md">{order.orderId}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-stone-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">Ngày tạo</span>
                    <span className="text-sm sm:text-base font-medium text-stone-900">
                      {dayjs(order.createAt).format('DD/MM/YYYY - HH:mm')}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-stone-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">Cập nhật lần cuối</span>
                    <span className="text-sm sm:text-base font-medium text-stone-900">
                      {dayjs(order.updateAt).format('DD/MM/YYYY - HH:mm')}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">Tạo bởi</span>
                    <span className="text-sm sm:text-base font-medium text-stone-900">{order.createBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid 2 cột cho thông tin khách hàng và giao hàng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Thông tin khách hàng */}
              <Card variant="outlined" className="shadow-sm">
                <CardHeader title={<h3 className="text-base sm:text-lg font-semibold text-stone-700">Thông tin khách hàng</h3>} />
                <CardContent sx={{ pt: 0 }}>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 py-2 sm:py-3">
                      <PersonRoundedIcon className="text-stone-500 flex-shrink-0" sx={{ mt: 0.5 }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-stone-500 mb-1">Tên khách hàng</p>
                        <p className="text-sm sm:text-base font-medium text-stone-900 truncate">{order.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2 sm:py-3">
                      <EmailRoundedIcon className="text-stone-500 flex-shrink-0" sx={{ mt: 0.5 }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-stone-500 mb-1">Email</p>
                        <p className="text-sm sm:text-base font-medium text-stone-900 truncate">{order.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2 sm:py-3">
                      <PhoneRoundedIcon className="text-stone-500 flex-shrink-0" sx={{ mt: 0.5 }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-stone-500 mb-1">Số điện thoại</p>
                        <p className="text-sm sm:text-base font-medium text-stone-900">{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin giao hàng */}
              <Card variant="outlined" className="shadow-sm">
                <CardHeader title={<h3 className="text-base sm:text-lg font-semibold text-stone-700">Địa chỉ giao hàng</h3>} />
                <CardContent sx={{ pt: 0 }}>
                  <div className="bg-stone-50 rounded-lg p-3 sm:p-4 lg:p-5">
                    <div className="flex items-start gap-3">
                      <RoomRoundedIcon className="text-stone-500 flex-shrink-0" sx={{ fontSize: { xs: 24, sm: 28 }, mt: 0.5 }} />
                      <p className="text-sm sm:text-base text-stone-900 leading-relaxed break-words">
                        {order.shipAddress || order.userAddress}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Divider className="my-6 sm:my-8" />

            {/* Danh sách sản phẩm */}
            <Card variant="outlined" className="shadow-sm">
              <CardHeader
                title={
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold text-stone-700">
                      Danh sách sản phẩm
                    </h3>
                    <span className="text-sm sm:text-base text-stone-600 font-normal">
                      {items.length} sản phẩm
                    </span>
                  </div>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                {items.length === 0 ? (
                  <p className="text-sm sm:text-base text-stone-500 text-center py-6 sm:py-8">
                    Không có sản phẩm nào trong đơn hàng này.
                  </p>
                ) : (
                  <div>
                    {items.map((item, index) => (
                      <OrderItemCard key={item.orderItemId} item={item} index={index} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Divider className="my-6 sm:my-8" />

            {/* Thanh toán */}
            <Card variant="outlined" className="shadow-sm">
              <CardHeader title={<h3 className="text-base sm:text-lg font-semibold text-stone-700">Thông tin thanh toán</h3>} />
              <CardContent sx={{ pt: 0 }}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between py-2 sm:py-3 border-b border-stone-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-stone-600 mb-1 sm:mb-0">Phương thức thanh toán</span>
                    <span className="text-sm sm:text-base font-medium text-stone-900">
                      {order.paymentMethod || 'Chưa xác định'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-3 sm:py-4 bg-stone-50 rounded-lg px-3 sm:px-4">
                    <span className="text-lg sm:text-xl font-semibold text-stone-900 mb-1 sm:mb-0">Tổng cộng</span>
                    <span className="text-xl sm:text-2xl font-bold text-stone-900">
                      {formatCurrency(order.amount)}
                    </span>
                  </div>
                  {totalFromItems !== order.amount && items.length > 0 && (
                    <div className="text-xs sm:text-sm text-amber-700 bg-amber-50 p-2 sm:p-3 rounded-lg">
                      Lưu ý: Tổng từ sản phẩm tính được là {formatCurrency(totalFromItems)}. Có thể có phí khác.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
              size="large"
              className="w-full sm:w-auto"
              sx={{ borderRadius: '8px', height: '44px', fontSize: '16px' }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/order-history')}
              size="large"
              className="w-full sm:w-auto"
              sx={{ borderRadius: '8px', height: '44px', fontSize: '16px' }}
            >
              Danh sách đơn hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
