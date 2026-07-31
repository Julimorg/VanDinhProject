import type { PublicProductDetail } from '@/Interface/Product/IGetProductsDetail';
import { product_api } from '../../../Api/Api_Handler/product_api';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type UseGetProductDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<PublicProductDetail>, 
    unknown, 
    IApiResponse<PublicProductDetail>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetProductDetail = (productId?: string, options?: UseGetProductDetailOptions) => {
  return useQuery<IApiResponse<PublicProductDetail>, unknown, IApiResponse<PublicProductDetail>, [string, string | undefined]>({
    queryKey: ["Get Product Detail", productId], 
    queryFn: () => product_api.GetProducDetail(productId!),
    enabled: !!productId, 
    ...options, 
  });
};