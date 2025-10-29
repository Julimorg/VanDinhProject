import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetProductSelectionResponse } from '@/Interface/Product/IGetProductSelection';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetProductSelectionOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetProductSelectionResponse>, 
    unknown, 
    IApiResponse<IGetProductSelectionResponse>, 
    [string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetProductSelections = (options?: UseGetProductSelectionOptions) => {
  return useQuery<IApiResponse<IGetProductSelectionResponse>, unknown, IApiResponse<IGetProductSelectionResponse>, [string | undefined]>({
    queryKey: [QueryKeys.GET_PRODUCT_SELECTION], 
    queryFn: () => docApi.GetProductSelection(),
    ...options, 
  });
};  