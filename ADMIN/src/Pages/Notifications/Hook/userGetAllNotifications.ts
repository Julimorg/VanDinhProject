import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllNotifications } from "@/Interface/Notification/IGetAllNotification";
import { NotificationsQueryParams } from "@/Constant/query-params";


type UseGetAllNotificationOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllNotifications>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllNotifications = (
  userId: string,
  params: NotificationsQueryParams = {},
  options?: UseGetAllNotificationOptions
) => {
  const { page = 0, size = 5, sort = "deliveredAt,desc" } = params;

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_ALL_NOTIFICATIONS, { page, size, sort }],
    queryFn: () => docApi.GetAllNotifications(userId, { page, size, sort }),
    enabled: true, 
  });
};