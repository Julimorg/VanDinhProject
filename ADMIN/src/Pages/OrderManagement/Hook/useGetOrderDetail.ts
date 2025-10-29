import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

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
    queryFn: () => docApi.GetOrderDetail(orderId!),
    enabled: !!orderId, 
    ...options, 
  });
};