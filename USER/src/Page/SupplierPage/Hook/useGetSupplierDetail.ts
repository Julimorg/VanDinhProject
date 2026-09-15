import { supplier_api } from "@/Api/Api_Handler/supplier_api";
import { QueryKeys } from "@/Constant/query-key";
import type { IApiResponse } from "@/Interface/IApiResponse";
import type { SupplierDetailResponse } from "@/Interface/Supplier/IGetSupplierDetail";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";


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
    queryFn: () => supplier_api.GetSupplierDetail(supplierId!),
    enabled: !!supplierId,
    ...options,     
  });
};