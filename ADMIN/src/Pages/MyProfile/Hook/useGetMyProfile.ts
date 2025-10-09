
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetMyProfileResponse } from "@/Interface/Users/IGetMyProfile";


type UserGetMyProfileOptions = Omit<
  UseQueryOptions<IApiResponse<IGetMyProfileResponse>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetMyProfile = (userId: string, options?: UserGetMyProfileOptions) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_MY_PROFILE],
    queryFn: () => docApi.GetMyProfile(userId),
    enabled: true, 
  });
};