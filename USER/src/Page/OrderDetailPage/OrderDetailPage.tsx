import React from 'react';
import { Button, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { IGetMyListOrder } from '../../Interface/Order/IGetMyListOrder';
import { getStatusConfig } from '../OrderHistoryPage/Components/OrderStatusConfig';
import { formatCurrency } from '../../Utils/utils';

const OrderDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order: IGetMyListOrder | undefined = (location.state as { order?: IGetMyListOrder })?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500">Không tìm thấy thông tin đơn hàng.</p>
          <Button onClick={() => navigate('/')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Modal-like Container (nhưng là full page) */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Chi tiết đơn hàng
                </h2>
                <p className="text-sm text-gray-500">
                  {order.orderCode}
                </p>
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
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
          <div className="px-6 py-5 space-y-5">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Mã đơn hàng</span>
                  <span className="text-sm font-medium text-gray-900">{order.orderCode}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">ID đơn hàng</span>
                  <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Ngày tạo</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(order.createAt).format('DD/MM/YYYY - HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(order.updateAt).format('DD/MM/YYYY - HH:mm')}
                  </span>
                </div>
              </div>
            </div>

            <Divider style={{ margin: 0 }} />

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thông tin giao hàng</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <EnvironmentOutlined className="text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-900">{order.shipAddress}</p>
                </div>
              </div>
            </div>

            <Divider style={{ margin: 0 }} />

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Phương thức</span>
                  <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 pt-3">
                  <span className="text-base font-medium text-gray-900">Tổng cộng</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.orderAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
            <Button
              type="primary"
              onClick={() => navigate('/')}
              style={{ borderRadius: '6px' }}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;