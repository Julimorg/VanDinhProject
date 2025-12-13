import { useEffect } from "react";
import { useWebSocketService } from "../Enum/useWebSocket";
import { useNotificationStore } from "../Middleware/useNotificationStore";
import { useAuthStoreCookiesStorage } from "../Middleware/useAuthStore";

const GlobalWebSocketListener = () => {
  const { id: userId } = useAuthStoreCookiesStorage();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const { connect, subscribe } = useWebSocketService(
    "http://localhost:8080/ws",
    () => {
      subscribe("/user/queue/notifications", (msg) => {
        addNotification({
          id: msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
        });
      });
      subscribe("/topic/public-notifications", (msg) => {
        addNotification({
          id: msg.notificationId,
          title: msg.title,
          description: msg.message,
          time: msg.createdAt,
          read: false,
        });
      });
    },
    (error) => {
      console.error("WebSocket Error:", error);
    }
  );

  useEffect(() => {
    if (userId) connect();
  }, [userId]);

  return null;
};

export default GlobalWebSocketListener;
