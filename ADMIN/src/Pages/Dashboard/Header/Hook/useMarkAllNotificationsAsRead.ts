import { docApi } from "@/Api/docApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useMarkAllNotificationsAsRead = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userNotificationId, body }: {
      userNotificationId: string;
      body: { isRead: boolean };
    }) => docApi.MarkNotificationAsRead(userNotificationId, body),

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
