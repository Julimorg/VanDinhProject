
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import type { IGetMyProfileResponse } from '../../../Interface/Users/IGetMyProfile';
import { user_api } from '../../../Api/user_api';
import { QueryKeys } from '../../../Constant/query-key';

type UseGetUserDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetMyProfileResponse>, 
    unknown, 
    IApiResponse<IGetMyProfileResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetUserDetail = (userId?: string, options?: UseGetUserDetailOptions) => {
  return useQuery<IApiResponse<IGetMyProfileResponse>, unknown, IApiResponse<IGetMyProfileResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_MY_PROFILE, userId], 
    queryFn: () => user_api.GetMyProfile(userId!),
    enabled: !!userId, 
    ...options, 
  });
};