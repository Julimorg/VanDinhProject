import { supplier_api } from '../../../Api/Api_Handler/supplier_api';
import { QueryKeys } from '../../../Constant/query-key';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import type { IGetSupplierSelectionResponse } from '../../../Interface/Supplier/IGetSupplierSelection';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type UseGetSupplierSelectionOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetSupplierSelectionResponse>, 
    unknown, 
    IApiResponse<IGetSupplierSelectionResponse>, 
    [string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetSupplierSelections = (options?: UseGetSupplierSelectionOptions) => {
  return useQuery<IApiResponse<IGetSupplierSelectionResponse>, unknown, IApiResponse<IGetSupplierSelectionResponse>, [string | undefined]>({
    queryKey: [QueryKeys.GET_SUPPLIER_SELECTION], 
    queryFn: () => supplier_api.GetSupplierSelection(),
    enabled: false,
    ...options, 
  });
};