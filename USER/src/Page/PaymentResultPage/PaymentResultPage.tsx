import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { order_api } from '../../Api/Api_Handler/order_api';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  
  // Lấy orderId từ VNPAY redirect (vnp_TxnRef chính là orderId)
  const orderId = searchParams.get('vnp_TxnRef');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');

  const { data, isLoading, error } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () => order_api.GetOrderDetail(orderId ?? ''),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const order = query.state.data?.data;
      if (!order) return 3000;
      if (order.paymentMethodStatus === 'Paid' || order.paymentMethodStatus === 'Failed') {
        return false; // Dừng poll
      }
      return 3000;
    },
    retry: 3,
    staleTime: 0,
  });

  const order = data?.data;

  // Nếu VNPAY báo lỗi ngay từ đầu (vd: hủy thanh toán)
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600">Lỗi</h1>
          <p className="mt-4">Không tìm thấy mã đơn hàng.</p>
          <button onClick={() => navigate('/')} className="mt-6 btn-primary">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Nếu VNPAY báo lỗi ngay từ đầu (ResponseCode != 00)
  if (vnpResponseCode !== '00') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-8xl mb-6">Failed</div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
          <p className="text-gray-600 mb-6">
            Mã lỗi từ VNPAY: <strong>{vnpResponseCode}</strong>
          </p>
          <button
            onClick={() => navigate(`/order/${orderId}`)}
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 text-lg"
          >
            Xem chi tiết đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Đang kiểm tra thanh toán...</h2>
          <p className="text-gray-500 mt-2">Vui lòng không tắt trang</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-orange-600">Lỗi kết nối</h1>
          <p className="mt-4">Không thể tải thông tin đơn hàng. Vui lòng thử lại.</p>
          <button onClick={() => window.location.reload()} className="mt-6 btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const isPaid = order?.paymentMethodStatus === 'Paid';

  return (
    <div className={`min-h-screen flex items-center justify-center ${isPaid ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-2xl">
        {isPaid ? (
          <>
            <div className="text-9xl mb-6">Success</div>
            <h1 className="text-5xl font-bold text-green-600 mb-6">
              Thanh toán thành công!
            </h1>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                Đơn hàng <strong className="text-2xl text-green-600">#{order?.orderCode || orderId}</strong>
              </p>
              <p className="text-4xl font-bold text-green-600">
                {order?.amount.toLocaleString('vi-VN')} ₫
              </p>
              <p>Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng!</p>
            </div>
            <div className="flex gap-6 justify-center mt-10">
              <button
                onClick={() => navigate(`/order/${orderId}`)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 text-lg font-medium shadow-lg"
              >
                Xem chi tiết đơn hàng
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 text-lg font-medium shadow-lg"
              >
                Về trang chủ
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-9xl mb-6">Failed</div>
            <h1 className="text-5xl font-bold text-red-600 mb-6">
              Thanh toán chưa hoàn tất
            </h1>
            <p className="text-xl text-gray-700">
              Trạng thái hiện tại: <strong>{order?.paymentMethodStatus || 'Pending'}</strong>
            </p>
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="mt-8 bg-red-600 text-white px-10 py-4 rounded-xl text-lg font-medium"
            >
              Xem lại đơn hàng
            </button>
          </>
        )}
      </div>
    </div>
  );
}