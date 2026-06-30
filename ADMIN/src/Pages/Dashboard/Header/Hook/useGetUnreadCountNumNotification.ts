import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetUnreadCountNumNotificationsOptions = Omit<
  UseQueryOptions<
    IApiResponse<number>, 
    unknown, 
    IApiResponse<number>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetUnreadCountNumNotifications = (userId?: string, options?: UseGetUnreadCountNumNotificationsOptions) => {
  return useQuery<IApiResponse<number>, unknown, IApiResponse<number>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_UNREAD_COUNT_NUM_NOTIFICATIONS, userId], 
    queryFn: () => docApi.GetUnreadCountNumNotification(userId!),
    enabled: !!userId, 
    ...options, 
  });
};