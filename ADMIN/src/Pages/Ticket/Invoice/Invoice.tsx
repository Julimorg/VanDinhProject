import { useLocation, useNavigate } from 'react-router-dom';
import { useOrderResponseStore } from '@/Store/OderResponseStore';
import { useEffect } from 'react';
import { useGetinvoice } from '../Hook/useGetInvoice';
import moment from 'moment';

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('transaction_id');
  const { data: invoiceData } = useGetinvoice(transactionId || '');

  useEffect(() => {
    if (transactionId) {
      console.log('Transaction ID:', transactionId);
    }
  }, [transactionId]);

  return (
    <div className="flex justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full p-6 transition-all duration-300 bg-white shadow-xl max-w-7xl rounded-2xl sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl">
        <h2 className="mb-8 text-2xl font-extrabold text-center text-[#016136] sm:text-3xl md:text-4xl tracking-tight">
          THÔNG TIN VÉ
        </h2>

        {/* Customer + Staff Info */}
        <div className="flex flex-col gap-8 mb-8 text-sm sm:text-base md:text-lg">
          <div className="grid grid-cols-1 gap-6 p-6 shadow-sm sm:grid-cols-2 lg:gap-10 bg-gray-50 rounded-xl">
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#016136]">Khách hàng:</span>
                <span className="text-gray-700">{invoiceData?.customer_name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#016136]">Sđt:</span>
                <span className="text-gray-700">{invoiceData?.customer_phone_number}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#016136]">Email:</span>
                <span className="text-gray-700">{invoiceData?.customer_email}</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#016136]">Nhân viên:</span>
                <span className="text-gray-700">{invoiceData?.receipter_name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[#016136]">Thời gian đặt vé:</span>
                <span className="text-gray-700">
                  {invoiceData?.create_at &&
                    moment
                      .utc(invoiceData.create_at, 'YYYY-MM-DD, HH:mm:ss')
                      .tz('Asia/Ho_Chi_Minh')
                      .format('YYYY/MM/DD - HH:mm:ss')}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 shadow-sm rounded-xl">
          <table className="w-full text-sm sm:text-base md:text-lg">
            <thead>
              <tr className="font-semibold bg-[#016136] text-white">
                <th className="px-4 py-3 text-left rounded-tl-xl">STT</th>
                <th className="px-4 py-3 text-left">Tên dịch vụ</th>
                <th className="px-4 py-3 text-left">Khách</th>
                <th className="px-4 py-3 text-left">Số lượng</th>
                <th className="px-4 py-3 text-left rounded-tr-xl">Giá</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.services.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-[#e6f4ea] transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{item.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.customer_type === 'ADULT' ? 'Người lớn' : 'Trẻ em'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-[#016136] font-medium">
                    {item.price.toLocaleString()} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-6 mt-8 text-base font-bold border-t-2 border-[#016136] sm:text-lg md:text-xl">
          <span className="text-[#016136]">Tổng cộng:</span>
          <span className="text-[#016136]">
            {invoiceData?.total_price?.toLocaleString() || 0} đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
