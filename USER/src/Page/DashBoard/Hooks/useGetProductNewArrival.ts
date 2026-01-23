
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import { QueryKeys } from '../../../Constant/query-key';
import type { IGetProductNewArrival } from '../../../Interface/Product/IGetProductNewArrival';
import { product_api } from '../../../Api/Api_Handler/product_api';

type UseGetProductNewArrivalOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetProductNewArrival>, 
    unknown, 
    IApiResponse<IGetProductNewArrival>, 
    [string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetProductNewArrival = (options?: UseGetProductNewArrivalOptions) => {
  return useQuery<IApiResponse<IGetProductNewArrival>, unknown, IApiResponse<IGetProductNewArrival>, [string | undefined]>({
    queryKey: [QueryKeys.GET_PRODUCT_NEW_ARRIVAL], 
    queryFn: () => product_api.GetProductNewArrvial(), 
    ...options, 
  });
};