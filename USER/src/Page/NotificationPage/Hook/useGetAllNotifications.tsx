import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
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
  params: NotificationsQueryParams,
  options?: UseGetAllNotificationOptions
) => {
  const {
    isRead,
    page = 0,
    size = 10,
  } = params;

  return useQuery({
    queryKey: [
      "notifications",
      userId,
      isRead ?? "all",
      page,
      size,
    ],
    queryFn: () =>
      notification_api.GetAllNotifications(userId!, {
        isRead,
        page,
        size,
      }),
    enabled: !!userId,
    // keepPreviousData: true,
    staleTime: 30_000,
    ...options,
  });
};
