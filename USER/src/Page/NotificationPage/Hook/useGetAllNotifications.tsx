import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";

import { notification_api } from "../../../Api/notification_api";
import type { IGetAllNotificationsResponse } from "../../../Interface/Notification/IGetAllNotifications";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";

type UseGetAllNotificationOptions = Omit<
  UseQueryOptions<
    IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>, 
    unknown, 
    IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetAllNotifications = (userId?: string, options?: UseGetAllNotificationOptions) => {
  return useQuery<IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>, unknown, IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>, [string, string | undefined]>({
    queryKey: ["Get all notifications", userId], 
    queryFn: () => notification_api.GetAllNotifications(userId!),
    enabled: !!userId, 
    ...options, 
  });
};