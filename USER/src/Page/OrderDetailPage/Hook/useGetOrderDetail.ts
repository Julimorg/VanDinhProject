import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IGetOrderDetailResponse } from "../../../Interface/Order/IGetOrderDetail";
import { QueryKeys } from "../../../Constant/query-key";
import { order_api } from "../../../Api/Api_Handler/order_api";


type UseGetOrderDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetOrderDetailResponse>, 
    unknown, 
    IApiResponse<IGetOrderDetailResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetOrderDetail = (orderId?: string, options?: UseGetOrderDetailOptions) => {
  return useQuery<IApiResponse<IGetOrderDetailResponse>, unknown, IApiResponse<IGetOrderDetailResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_ORDER_DETAIL, orderId], 
    queryFn: () => order_api.GetOrderDetail(orderId!),
    enabled: !!orderId, 
    ...options, 
  });
};