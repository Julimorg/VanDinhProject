import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification_api } from "../../../Api/notification_api";

export const useMarkNotificationAsRead = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userNotificationId, body }: {
      userNotificationId: string;
      body: { isRead: boolean };
    }) => notification_api.MarkNotificationAsRead(userNotificationId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
        exact: false,
      });
    },
    onError: () => {
      console.log("Failed to mark notification as read");
    }
  });
};
