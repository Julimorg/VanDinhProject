import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

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
    queryFn: () => docApi.GetSupplierSelection(),
    ...options, 
  });
};