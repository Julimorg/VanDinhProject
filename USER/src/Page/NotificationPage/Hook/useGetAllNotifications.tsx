import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";

import { notification_api } from "../../../Api/notification_api";
import type { IGetAllNotificationsResponse } from "../../../Interface/Notification/IGetAllNotifications";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";

type NotificationsQueryParams = {
  isRead?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

type UseGetAllNotificationOptions = Omit<
  UseQueryOptions<
    IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>, 
    unknown
  >,
  'queryKey' | 'queryFn'
>;

export const useGetAllNotifications = (
  userId: string | undefined,
  params: NotificationsQueryParams = {},
  options?: UseGetAllNotificationOptions
) => {
  return useQuery({
    queryKey: ['get-all-notifications', userId, params],
    queryFn: () => notification_api.GetAllNotifications(userId!, params),
    enabled: !!userId,
    ...options,
  });
};
