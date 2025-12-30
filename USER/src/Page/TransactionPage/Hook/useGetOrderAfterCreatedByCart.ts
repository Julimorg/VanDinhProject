
import { useQuery } from '@tanstack/react-query';
import { order_api } from '../../../Api/Api_Handler/order_api';
import type { IGetOrderDetailResponse } from '../../../Interface/Order/IGetOrderDetail';
import { QueryKeys } from '../../../Constant/query-key';

export const useGetOrderAfterCreatedByCart = (orderId: string) => {
  return useQuery<IGetOrderDetailResponse>({
    queryKey: [QueryKeys.GET_ORDER_DETAIL, orderId],
    queryFn: async () => {
      const res = await order_api.GetOrderDetail(orderId);
      if (!res.data) throw new Error(res.message || 'Không tải được đơn hàng');
      return res.data;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
};