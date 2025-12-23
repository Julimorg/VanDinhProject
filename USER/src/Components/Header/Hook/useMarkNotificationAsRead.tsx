import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { IMarkNotificationAsReadRequest, IMarkNotificationAsReadResponse } from "../../../Interface/Notification/IMarkNotificationAsRead";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { notification_api } from "../../../Api/notification_api";

type payload = {
  userNotificationId: string;
  body: IMarkNotificationAsReadRequest;
};

type UseMarkNotificationAsReadtOptions = Omit<
  UseMutationOptions<
    IApiResponse<IMarkNotificationAsReadResponse>,
    Error,
    payload
  >,
  "mutationFn"
>;

export const useMarkNotificationAsRead = (options?: UseMarkNotificationAsReadtOptions) => {
    return useMutation({
        mutationFn: ({userNotificationId, body }) => notification_api.MarkNotificationAsRead(userNotificationId, body),
        ...options,
    })
}