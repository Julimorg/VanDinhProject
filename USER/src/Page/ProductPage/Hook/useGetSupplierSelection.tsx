import { supplier_api } from '../../../Api/supplier_api';
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
    queryKey: ["Get Supplier Selection"], 
    queryFn: () => supplier_api.GetSupplierSelection(),
    ...options, 
  });
};