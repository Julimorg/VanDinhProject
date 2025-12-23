import { useEffect } from "react";
import { useWebSocketService } from "../Hook/useWebSocket";
import { useNotificationStore } from "../Middleware/useNotificationStore";
import { useAuthStoreCookiesStorage } from "../Middleware/useAuthStore";

const GlobalWebSocketListener = () => {
  const { id: userId, accessToken } = useAuthStoreCookiesStorage();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const { connect, subscribe, disconnect } = useWebSocketService(
    "http://localhost:8080/ws",
    () => {
      subscribe("/user/queue/notifications", (msg) => {
        console.log("Private Notification received:", msg);
        addNotification({
          id: msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
          type: msg.type,
        });
      });

      subscribe("/topic/public-notifications", (msg) => {
        console.log("Public Notification received:", msg);
        addNotification({
          id: msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
          type: msg.type,
        });
      });

      subscribe("/topic/admin-broadcast", (msg) => {
        console.log("Public Notification received:", msg);
        addNotification({
          id: msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
          type: msg.type,
        });
      });

    },
    (error) => {
      console.error("WebSocket Error:", error);
    }
  );
  useEffect(() => {
    // Chỉ connect khi có cả userId VÀ accessToken
    if (userId && accessToken) {
      connect(accessToken); // Truyền token vào đây
    }

    // Cleanup khi unmount hoặc khi user logout (accessToken mất)
    return () => {
        if (!accessToken) {
            disconnect();
        }
    };
  }, [userId, accessToken, connect, disconnect]);

  // useEffect(() => {
  //   if (userId) connect();
  // }, [userId]);

  return null;
};

export default GlobalWebSocketListener;
