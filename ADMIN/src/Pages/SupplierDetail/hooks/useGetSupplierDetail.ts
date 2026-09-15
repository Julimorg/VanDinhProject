import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IGetDiaryDetailRes } from '@/Interface/Diary/GetDiaryDetail';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetPurchaseOrderDetailResponse } from '@/Interface/Inventory/GetPurchaseOrderDetail';
import { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { SupplierDetailResponse } from '@/Interface/Supplier/IGetSupplierDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type GetSupplierDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<SupplierDetailResponse>, 
    unknown, 
    IApiResponse<SupplierDetailResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;
    
export const useGetSupplierDetail = (supplierId?: string, options?: GetSupplierDetailOptions) => {
  return useQuery<IApiResponse<SupplierDetailResponse>, unknown, IApiResponse<SupplierDetailResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_SUPPLIER_DETAIL, supplierId],
    queryFn: () => docApi.GetSupplierDetail(supplierId!),
    enabled: !!supplierId,
    ...options,     
  });
};