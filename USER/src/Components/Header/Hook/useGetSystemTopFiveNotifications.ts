import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IGetNotificationResponse } from "../../../Interface/Notification/IGetNotification";
import { notification_api } from "../../../Api/Api_Handler/notification_api";

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
    queryKey: ["Get five notifications", userId], 
    queryFn: () => notification_api.GetMyNotification(userId!),
    enabled: !!userId, 
    ...options, 
  });
};