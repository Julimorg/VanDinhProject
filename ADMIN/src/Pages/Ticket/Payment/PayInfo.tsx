import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useOrderSuccess } from '../Hook/useOrderSuccess';
import { useOrderResponseStore } from '@/Store/OderResponseStore';
import PaymentKeyboard from '../Component/PaymentKeyboard';
import QRCode from './Component/QRCode';
import { useMomoOrder } from '../Hook/useMomopay';
import ButtonLoading from '@/Components/ButtonLoading/ButtonLoading';
import PaymentMethodSelector from './Component/PaymentMethodSelector';
import OrderInfo from './Component/OrderInfo';
import ButtonText from '@/Components/ButtonText-H';
import { useBookingStore } from '@/Store/BookingStore';
import { useSignalRPaymentListener } from './Hook/useSignalRMomo';

const PayInfo: React.FC = () => {
  const { orderResponse, clearOrderResponse } = useOrderResponseStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'momo'>('cash');

  const [qrBill, setQrBill] = useState<string | null>(null);
  const [qrTicket, setQrTicket] = useState<string | null>(null);

  useSignalRPaymentListener(orderResponse?.cart_id);
  const clearBooking = useBookingStore((state) => state.clearBooking);

  const { mutate: cashPayment } = useOrderSuccess({
    onSuccess: (data) => {
      if (selectedMethod === 'cash') {
        setQrBill(data.data.qrBill);
        setQrTicket(data.data.qrTicket);
        clearBooking();
      } else {
        alert('Thanh toán không thành công');
        clearOrderResponse();
      }
    },
    onError: () => alert('Thanh toán thất bại'),
  });

  const { mutate: momoPayment } = useMomoOrder({
    onSuccess: (data) => {
      if (data.isSuccess && data.value) {
        setQrBill(data.value);
        clearBooking();
      } else {
        alert('Thanh toán không thành công');
        clearOrderResponse();
      }
    },
  });

  const handlePayment = () => {
    if (!orderResponse?.cart_id) {
      alert('Không tìm thấy mã đơn hàng!');
      return;
    }

    setIsLoading(true);

    if (selectedMethod === 'cash') {
      cashPayment(
        {
          cart_id: orderResponse.cart_id,
          method: 'cash',
        },
        {
          onSettled: () => setIsLoading(false),
        }
      );
    } else if (selectedMethod === 'momo') {
      const totalAmount = Math.round(orderResponse.total_price || 0);
      momoPayment(
        {
          cart_id: orderResponse.cart_id,
          amount: totalAmount,
          description: `Thanh toán MoMo cho đơn hàng ${orderResponse.total_price}`,
        },
        {
          onSettled: () => setIsLoading(false),
        }
      );
    }
  };

  const handleBack = () => {
    navigate('/ticket');
  };

  const handleCancel = () => {
    clearOrderResponse();
    useBookingStore.getState().clearBooking();
    navigate('/ticket');
  };

  const handleGoHome = () => {
    setQrBill(null);
    setQrTicket(null);
    navigate('/ticket');
  };

  return (
    <div className="flex flex-col max-w-6xl gap-6 px-4 mx-auto mt-6 lg:flex-row ml-[32rem]">
      <div className="w-full lg:w-2/3">
        <div className="flex gap-4 mb-6 no-print">
          {!qrBill && !qrTicket ? (
            <>
              <ButtonText
                label="Quay lại"
                onClick={handleBack}
                className="flex-1 py-3 text-lg font-semibold text-white transition duration-200 bg-gray-500 border-none rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              />
              <ButtonText
                label="Hủy"
                onClick={handleCancel}
                className="flex-1 py-3 text-lg font-semibold text-white transition duration-200 bg-red-500 border-none rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              />
            </>
          ) : (
            <>
              <ButtonText
                label="Quay về trang vé"
                onClick={handleGoHome}
                className="flex-1 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-600 border-none rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              />
              <ButtonText
                label="In vé"
                onClick={() => window.print()}
                className="flex-1 py-3 text-lg font-semibold text-white transition duration-200 bg-green-600 border-none rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              />
            </>
          )}
        </div>

        <div id="printable" className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <OrderInfo {...orderResponse} />

          {!(qrBill && selectedMethod === 'cash') && (
            <>
              <PaymentMethodSelector selectedMethod={selectedMethod} onSelect={setSelectedMethod} />
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full py-3 mt-6 text-lg font-semibold text-white rounded-lg shadow-md transition duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                }`}
              >
                {isLoading ? <ButtonLoading /> : 'Tiến hành thanh toán'}
              </button>
            </>
          )}

          {qrBill && qrTicket && selectedMethod === 'cash' && (
            <div className="flex flex-col items-center gap-8 mt-8">
              <div className="flex flex-col items-center p-4 bg-gray-100 border rounded-lg qr-wrapper">
                <QRCode src={qrBill} mode="inline" title="Mã QR Hóa Đơn" />
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 border rounded-lg qr-wrapper">
                <QRCode src={qrTicket} mode="inline" title="Mã QR Vé" />
              </div>
            </div>
          )}

          {qrBill && selectedMethod === 'momo' && (
            <QRCode
              title="Thanh toán MoMo cho đơn hàng"
              src={qrBill}
              mode="modal"
              onClose={() => {
                setQrBill(null);
                navigate('/ticket');
              }}
            />
          )}
        </div>
      </div>

      {selectedMethod === 'cash' && orderResponse?.total_price && !qrBill && !qrTicket && (
        <div className="w-full lg:w-1/3">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <PaymentKeyboard total={orderResponse.total_price} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PayInfo;
