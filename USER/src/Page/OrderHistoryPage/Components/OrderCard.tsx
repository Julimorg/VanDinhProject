import React from 'react';
import { Button, Divider } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  CreditCardOutlined, 
  ShoppingOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { getStatusConfig } from './OrderStatusConfig';
import type { IGetMyListOrder } from '../../../Interface/Order/IGetMyListOrder';
import { formatPrice } from '../../../Utils/utils';

interface OrderCardProps {
  order: IGetMyListOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(order.orderStatus);

  const handleViewDetail = () => {
    navigate(`/order-detail/${order.orderId}`, { state: { order } });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Status Bar */}
      <div
        className="h-1.5 rounded-t-lg"
        style={{ backgroundColor: statusConfig.color }}
      />
     
      <div className="p-5">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <FileTextOutlined className="text-2xl text-gray-400" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {order.orderCode}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {order.orderId}
              </p>
            </div>
          </div>
         
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold w-fit"
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
        <Divider style={{ margin: '16px 0' }} />
        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <EnvironmentOutlined className="text-lg text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
              <p className="text-sm text-gray-900">{order.shipAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCardOutlined className="text-lg text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
              <p className="text-sm text-gray-900">{order.paymentMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarOutlined className="text-lg text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Ngày tạo</p>
              <p className="text-sm text-gray-900">
                {dayjs(order.createAt).format('DD/MM/YYYY - HH:mm')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingOutlined className="text-lg text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
              <p className="text-base font-semibold text-gray-900">
                {formatPrice(order.orderAmount)}
              </p>
            </div>
          </div>
        </div>
        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleViewDetail}
            className="text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900"
            style={{ borderRadius: '6px' }}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;