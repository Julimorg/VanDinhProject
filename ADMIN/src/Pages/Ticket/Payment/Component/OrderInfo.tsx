import React from 'react';
import moment from 'moment-timezone';

interface Service {
  name: string;
  customer_type: 'ADULT' | 'CHILDREN';
  quantity: number;
  price: number;
}

interface Props {
  customer_name?: string;
  customer_phone_number?: string;
  customer_email?: string;
  receipter_name?: string;
  create_at?: string;
  services?: Service[];
  total_price?: number;
}

const OrderInfo: React.FC<Props> = ({
  customer_name,
  customer_phone_number,
  customer_email,
  receipter_name,
  create_at,
  services = [],
  total_price = 0,
}) => {
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">THÔNG TIN THANH TOÁN</h2>
      <div className="flex items-center justify-between mb-4 text-xl">
        <div>
          <p>
            <strong>Khách hàng:</strong> {customer_name}
          </p>
          <p>
            <strong>SDT:</strong> {customer_phone_number}
          </p>
          <p>
            <strong>Email:</strong> {customer_email}
          </p>
        </div>
      </div>
      <div>
        <p>
          <strong>Nhân viên:</strong> {receipter_name}
        </p>
        <p>
          <strong>Thời gian đặt vé:</strong>{' '}
          {create_at
            ? moment(create_at, 'YYYY-MM-DD, HH:mm:ss')
                .tz('Asia/Ho_Chi_Minh')
                .add(7, 'hours')
                .format('YYYY/MM/DD - HH:mm:ss')
            : '-'}
        </p>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">STT</th>
            <th>Tên dịch vụ</th>
            <th>Khách</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.customer_type === 'ADULT' ? 'Người lớn' : 'Trẻ em'}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between pt-4 text-xl font-semibold border-t">
        <span>Tổng cộng:</span>
        <span>{total_price.toLocaleString()} đ</span>
      </div>
    </>
  );
};

export default OrderInfo;
