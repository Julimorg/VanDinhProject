import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { notification_api } from "../../../Api/Api_Handler/notification_api";
import { useAuthStore } from "../../../Middleware/useAuthStoreWithLocal";

type UseGetUnreadCountOptions = Omit<
  UseQueryOptions<
    IApiResponse<number>,
    unknown,
    IApiResponse<number>,
    [string, string | undefined]
  >,
  "queryKey" | "queryFn"
>;

export const useGetUnreadNotificationCount = (
  userId?: string,
  options?: UseGetUnreadCountOptions
) => {
  const { accessToken } = useAuthStore();

  return useQuery<
    IApiResponse<number>,
    unknown,
    IApiResponse<number>,
    [string, string | undefined]
  >({
    queryKey: ["notification-unread-count", userId],
    queryFn: () => notification_api.GetUnreadCount(userId!),
    enabled: !!(userId && accessToken && options?.enabled !== false),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    ...options,
  });
};
