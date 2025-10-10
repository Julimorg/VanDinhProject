import { docApi } from '@/Api/docApi';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetUserDetailResponse } from '@/Interface/Users/IGetUserDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetUserDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetUserDetailResponse>, 
    unknown, 
    IApiResponse<IGetUserDetailResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetUserDetail = (userId?: string, options?: UseGetUserDetailOptions) => {
  return useQuery<IApiResponse<IGetUserDetailResponse>, unknown, IApiResponse<IGetUserDetailResponse>, [string, string | undefined]>({
    queryKey: ['userDetail', userId], 
    queryFn: () => docApi.GetUserDetail(userId!),
    enabled: !!userId, 
    ...options, 
  });
};