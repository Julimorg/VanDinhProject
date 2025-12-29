import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { UserOnlineStatusParams } from "@/Constant/query-params";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IGetUserOnlineStatus } from "@/Interface/Notification/IGetUserOnlineStatus";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetUserOnlineStatus = Omit<
     UseQueryOptions<IApiResponse<IApiResponsePagination<IGetUserOnlineStatus>>, unknown>,
    'queryKey' | 'queryFn'
>;

export const useGetUserOnlineStatus = (
    params: UserOnlineStatusParams = {},
    options?: UseGetUserOnlineStatus) => {
    const { page = 0, size = 5, sort = "userName, desc" } = params;

    return useQuery({
        queryKey: [QueryKeys.GET_USER_ONLINE_STATUS, { page, size, sort }],
        queryFn: () => docApi.GetUserOnlineStatus({ page, size, sort }),
        ...options,
    });
};