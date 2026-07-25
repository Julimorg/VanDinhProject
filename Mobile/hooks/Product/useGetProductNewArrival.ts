
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '../../constants/query-key';
import { IApiResponse } from '../../Interface/IApiResponse';
import { IGetProductNewArrival } from '../../Interface/Product/IGetProductNewArrival';
import { docApi } from '../../Api/docApi';

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
    queryFn: () => docApi.GetProductNewArrvial(), 
    ...options, 
  });
};