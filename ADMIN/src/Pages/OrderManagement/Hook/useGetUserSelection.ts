import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetUserSelectionResponse } from '@/Interface/Users/IGetUserSelection';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetUserSelectionOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetUserSelectionResponse>, 
    unknown, 
    IApiResponse<IGetUserSelectionResponse>, 
    [string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetUserSelections = (options?: UseGetUserSelectionOptions) => {
  return useQuery<IApiResponse<IGetUserSelectionResponse>, unknown, IApiResponse<IGetUserSelectionResponse>, [string | undefined]>({
    queryKey: [QueryKeys.GET_USER_SELECTION], 
    queryFn: () => docApi.GetUserSelection(),
    ...options, 
  });
};  