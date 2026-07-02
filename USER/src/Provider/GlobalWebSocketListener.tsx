import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWebSocketService } from "../Hook/useWebSocket";
import { useNotificationStore } from "../Middleware/useNotificationStore";
import { PUBLIC_API } from "../Utils/env_dev_handler";
import { useAuthStore } from "../Middleware/useAuthStoreWithLocal";

const GlobalWebSocketListener = () => {
  const { id: userId, accessToken } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const { connect, subscribe, disconnect } = useWebSocketService(
    `${PUBLIC_API}/ws`,
    () => {
      // Public broadcast - không gắn liền unread count cá nhân, chỉ hiển thị.
      subscribe("/topic/public-notifications", (msg) => {
        console.log("Public Notification received:", msg);
        addNotification({
          id: msg.userNotificationId ?? msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
          type: msg.type,
        });

        toast.info(msg.message ?? msg.title, {
          toastId: msg.notificationId, // tránh toast trùng nếu socket bắn lại
        });
      });

      // Private notification content - full payload cho 1 user cụ thể.
      subscribe("/user/queue/notifications", (msg) => {
        console.log("Private Notification received:", msg);
        addNotification({
          id: msg.userNotificationId ?? msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
          type: msg.type,
        });

        // toastId = notificationId để nếu vì lý do gì đó BE/FE gửi lặp,
        // react-toastify tự bỏ qua toast trùng thay vì hiện chồng nhiều lần.
        toast.info(
          <div>
            <strong>{msg.title}</strong>
            <div style={{ fontSize: 13 }}>{msg.message}</div>
          </div>,
          { toastId: msg.notificationId }
        );
      });

      // Private unread count - số lượng chính xác từ server, luôn ghi đè
      // giá trị hiện tại trong store (không cộng dồn thủ công ở FE).
      subscribe("/user/queue/unread-count", (msg) => {
        console.log("Unread count received:", msg);
        // BE gửi trực tiếp số nguyên qua convertAndSendToUser(userId, dest, unreadCount)
        // nên msg ở đây chính là số, không phải object { count: number }.
        const count = typeof msg === "number" ? msg : msg?.count ?? 0;
        setUnreadCount(count);
      });

      // subscribe("/topic/admin-broadcast", (msg) => {
      //   console.log("Public Notification received:", msg);
      //   addNotification({
      //     id: msg.notificationId,
      //     title: msg.title,
      //     description: msg.message,
      //     time: msg.createdAt,
      //     read: false,
      //     type: msg.type,
      //   });
      // });
    },
    (error) => {
      console.error("WebSocket Error:", error);
    }
  );

  useEffect(() => {
    if (userId && accessToken) {
      connect(accessToken);
    }

    return () => {
      if (!accessToken) {
        disconnect();
      }
    };
  }, [userId, accessToken, connect, disconnect]);

  return null;
};

export default GlobalWebSocketListener;