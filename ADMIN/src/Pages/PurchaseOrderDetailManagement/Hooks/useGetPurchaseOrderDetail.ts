import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetPurchaseOrderDetailResponse } from '@/Interface/Inventory/GetPurchaseOrderDetail';
import { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type GetPurchaseOrderDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetPurchaseOrderDetailResponse>, 
    unknown, 
    IApiResponse<IGetPurchaseOrderDetailResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;
    
export const useGetPurchaseOrderDetail = (purchaseOrderId?: string, options?: GetPurchaseOrderDetailOptions) => {
  return useQuery<IApiResponse<IGetPurchaseOrderDetailResponse>, unknown, IApiResponse<IGetPurchaseOrderDetailResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_PURCHASE_DETAIL, purchaseOrderId], 
    queryFn: () => docApi.GetPurchaseOrderDetail(purchaseOrderId!),
    enabled: !!purchaseOrderId, 
    ...options, 
  });
};