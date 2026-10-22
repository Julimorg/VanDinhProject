import React from 'react';
import { Button, Divider } from '@mui/material';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
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
  const statusConfig = getStatusConfig(order.orderStatus.toLowerCase());

  const handleViewDetail = () => {
    navigate(`/order-detail/${order.orderId}`, { state: { order } });
  };

  return (
    <div
      onClick={handleViewDetail}
      className="bg-white rounded-lg border border-stone-200 hover:border-stone-900 hover:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-stone-50 border-b border-stone-100">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-bold text-stone-900">{order.orderCode}</span>
          <span className="text-xs text-stone-400">
            {dayjs(order.createAt).format('DD/MM/YYYY · HH:mm')}
          </span>
        </div>

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            color: statusConfig.color,
            backgroundColor: statusConfig.bgColor,
            border: `1px solid ${statusConfig.borderColor}`,
          }}
        >
          {statusConfig.icon}
          <span>{statusConfig.text}</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-stone-600 mb-3">
          <div className="flex items-center gap-1.5">
            <ShoppingBagRoundedIcon sx={{ fontSize: 17 }} className="text-stone-400" />
            <span>{order.total_quantity} sản phẩm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCardRoundedIcon sx={{ fontSize: 17 }} className="text-stone-400" />
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <RoomRoundedIcon sx={{ fontSize: 17 }} className="text-stone-400 flex-shrink-0" />
            <span className="truncate max-w-[14rem] sm:max-w-xs">{order.shipAddress}</span>
          </div>
        </div>

        <Divider className="mb-3" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-500 mr-1.5">Tổng cộng:</span>
            <span className="text-lg font-bold text-stone-900">{formatPrice(order.orderAmount)}</span>
          </div>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail();
            }}
            sx={{ borderRadius: '4px', flexShrink: 0 }}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
