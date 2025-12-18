import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ISendNotificationsRequest, ISendNotificationsResponse } from "@/Interface/Notification/ISendNotifications";

type UseSendNotificationsOptions = Omit<
  UseMutationOptions<
    IApiResponse<ISendNotificationsResponse>,
    Error,
    ISendNotificationsRequest
  >,
  "mutationFn"
>;

export const useSendNotifications = (options?: UseSendNotificationsOptions) => {
  return useMutation({
    mutationFn: (body: ISendNotificationsRequest) => docApi.SendNotifications(body),
    ...options,
  });
};
