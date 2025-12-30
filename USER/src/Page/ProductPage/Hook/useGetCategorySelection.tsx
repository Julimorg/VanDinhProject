import { category_api } from '../../../Api/Api_Handler/category_api';
import { QueryKeys } from '../../../Constant/query-key';
import type { IGetCategorySelectionResponse } from '../../../Interface/Category/IGetCategorySelection';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

type UseGetCategorySelectionOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetCategorySelectionResponse>, 
    unknown, 
    IApiResponse<IGetCategorySelectionResponse>, 
    [string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetCategorySelection = (options?: UseGetCategorySelectionOptions) => {
  return useQuery<IApiResponse<IGetCategorySelectionResponse>, unknown, IApiResponse<IGetCategorySelectionResponse>, [string | undefined]>({
    queryKey: [QueryKeys.GET_CATEGORY_SELECTION], 
    queryFn: () => category_api.GetCategorySelection(),
    enabled: false,
    ...options, 
  });
};