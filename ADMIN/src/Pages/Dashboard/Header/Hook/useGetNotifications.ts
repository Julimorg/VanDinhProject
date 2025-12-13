import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetNotificationResponse } from "@/Interface/Notification/IGetNotification";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetNotificationOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetNotificationResponse>, 
    unknown, 
    IApiResponse<IGetNotificationResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetNotifications = (userId?: string, options?: UseGetNotificationOptions) => {
  return useQuery<IApiResponse<IGetNotificationResponse>, unknown, IApiResponse<IGetNotificationResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_NOTIFICATIONS, userId], 
    queryFn: () => docApi.GetMyNotification(userId!),
    enabled: !!userId, 
    ...options, 
  });
};