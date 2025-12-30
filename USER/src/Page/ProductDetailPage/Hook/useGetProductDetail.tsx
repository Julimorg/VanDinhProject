import { product_api } from '../../../Api/Api_Handler/product_api';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import type { IGetProductDetailResponse } from '../../../Interface/Product/IGetProductsDetail';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

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
    queryKey: ["Get Product Detail", productId], 
    queryFn: () => product_api.GetProducDetail(productId!),
    enabled: !!productId, 
    ...options, 
  });
};