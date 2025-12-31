import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/constants/query-key';
import { IGetCategorySelectionResponse } from '@/Interface/Category/IGetCategorySelection';

import { IApiResponse } from '@/Interface/IApiResponse';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

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
    queryFn: () => docApi.GetCategorySelection(),
    ...options, 
  });
};