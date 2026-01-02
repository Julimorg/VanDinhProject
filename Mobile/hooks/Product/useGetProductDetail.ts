import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/constants/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetProductDetailResponse } from '@/Interface/Product/IGetProductsDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetProductDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetProductDetailResponse>, 
    unknown, 
    IApiResponse<IGetProductDetailResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetProductDetail = (productId?: string, options?: UseGetProductDetailOptions) => {
  return useQuery<IApiResponse<IGetProductDetailResponse>, unknown, IApiResponse<IGetProductDetailResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_PRODUCT_DETAIL, productId], 
    queryFn: () => docApi.GetProducDetail(productId!),
    enabled: !!productId, 
    ...options, 
  });
};