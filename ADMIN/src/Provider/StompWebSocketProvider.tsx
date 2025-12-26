import { useAuthStore } from '@/Store/IAuth';
import {
  LOCAL_API_RAW,
  WEBSOCKET_CHANNEL_NOTIFICATIONS,
  WEBSOCKET_TAIL,
} from '@/Utils/env_dev_handler';
import { Client } from '@stomp/stompjs';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';

// Định nghĩa type
export interface StompWebSocketContextType {
  isConnected: boolean;
  notifications: any[];
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  subscribe: (destination: string, callback: (data: any) => void) => () => void;
  sendMessage: (destination: string, body: any) => void;
  clearNotifications: () => void;
  requestNotificationPermission: () => void;
}

// Tạo context (chỉ ở đây thôi)
const StompWebSocketContext = createContext<StompWebSocketContextType | null>(null);

// Custom hook (export để dùng ở các component khác)
export const useStompWebSocket = (): StompWebSocketContextType => {
  const context = useContext(StompWebSocketContext);
  if (!context) {
    throw new Error('useStompWebSocket must be used within StompWebSocketProvider');
  }
  return context;
};

export const StompWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef(new Map());

  const LOCAL_API = LOCAL_API_RAW;
  const WS_TAIL = WEBSOCKET_TAIL;
  const WS_NOTI_CHANNEL = WEBSOCKET_CHANNEL_NOTIFICATIONS;

  const accessToken = useAuthStore((state) => state.accessToken);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  //* ==================== CONNECT ====================

  const connectWebSocket = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('🔄 Đang khởi tạo kết nối STOMP WebSocket...');
      console.log('🔗 Endpoint:', `${LOCAL_API}${WS_TAIL}`);
      console.log('🔑 Có access token:', !!accessToken);

      if (!accessToken) {
        toast.warn('Something went wrong! Please try again later!');
        console.warn('⚠️ No access token. Cannot connect WebSocket.');
        reject(new Error('Something went wrong! Please try again later! '));
        return;
      }

      //? Check xem đã connect rồi thì ko cần connect lại
      if (clientRef.current?.connected) {
        console.log(' WebSocket already connected');
        resolve();
        return;
      }

      console.log('🔄 Connecting STOMP WebSocket...');

      const client = new Client({
        webSocketFactory: () => new SockJS(`${LOCAL_API}${WS_TAIL}`),


        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },

        debug: (str) => {
          console.log('Debug log WS: ', str);
        },

        reconnectDelay: 5000, // Auto reconnect sau 5s
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        //? Bắt đầu Connect vào những Channel mà Server đã tạo
        onConnect: (frame) => {
          console.info('STOMP Connected! ', frame);
          setIsConnected(true);

          subscribeToNotifications();

          resolve();
        },

        onDisconnect: (frame) => {
          console.info('STOMP Disconnected! ', frame);

          setIsConnected(false);

          subscriptionsRef.current.clear();
        },

        //* ==> Debug and Catch Error

        onStompError: (frame) => {
          console.error('STOMP Error : ', frame);

          //? Nếu lỗi authentication → logout
          if (frame.headers.message?.includes('401') || frame.headers.message?.includes('403')) {
            console.error('🚫 Authentication error, logging out...');
            clearTokens();
          }

          reject(new Error(frame.headers.message));
        },

        onWebSocketError: (frame) => {
          console.error('WebSocket Error : ', frame);
          reject(frame);
        },
      });

      client.activate();
      clientRef.current = client;
    });
  }, [accessToken, clearTokens]);

  useEffect(() => {
    if (accessToken && !isConnected) {
      console.log('🔄 Tự động kết nối WebSocket vì có token mới');
      connectWebSocket().catch((err) => {
        console.error('Auto connect failed:', err);
      });
    }
  }, [accessToken, isConnected, connectWebSocket]);

  //* ==================== DISCONNECT ====================
  const disconnectWebSocket = useCallback(() => {
    if (clientRef.current) {
      console.info('🔌 Manually disconnecting WebSocket...');
      clientRef.current.deactivate();
      setIsConnected(false);
      setNotifications([]);
      subscriptionsRef.current.clear();
      clientRef.current = null;
    }
  }, []);

  //* ==================== AUTO DISCONNECT KHI LOGOUT ====================
  useEffect(() => {
    if (!accessToken && clientRef.current) {
      console.log('⚠️ No token detected, disconnecting WebSocket...');
      disconnectWebSocket();
    }
  }, [accessToken, disconnectWebSocket]);

  //* ======== ============ SUBSCRIBE CHANNEL ====================

  //? Subscribe Notifications
  const subscribeToNotifications = useCallback(() => {
    if (!clientRef.current || !isConnected) return;

    try {
      console.info('Subscribing to /user/queue/notifications');

      const subscription = clientRef.current.subscribe(`${WS_NOTI_CHANNEL}`, (message) => {
        try {
          const notification = JSON.parse(message.body);

          console.info('New notification:', notification);

          setNotifications((prev) => [notification, ...prev].slice(0, 100));

          //? Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title || 'New Notification', {
              body: notification.message,
              icon: '/notification-icon.png',
            });
          }
        } catch (error) {
          console.error(' Parse notification error:', error);
        }
      });

      subscriptionsRef.current.set('notifications', subscription);
    } catch (error) {
      console.error('Subscribe error:', error);
    }
  }, [isConnected]);
  

  //* ==================== GENERIC SUBSCRIBE ====================
  const subscribe = useCallback(
    (destination: string, callback: (data: any) => void): (() => void) => {
      if (!clientRef.current?.connected) {
        console.warn('⚠️ Cannot subscribe: Not connected');
        return () => {};
      }

      try {
        console.log(`📡 Subscribing to: ${destination}`);

        const subscription = clientRef.current.subscribe(destination, (message) => {
          try {
            const data = JSON.parse(message.body);
            callback(data);
          } catch {
            callback(message.body);
          }
        });

        subscriptionsRef.current.set(destination, subscription);

        return () => {
          console.log(`🔕 Unsubscribing from: ${destination}`);
          subscription.unsubscribe();
          subscriptionsRef.current.delete(destination);
        };
      } catch (error) {
        console.error('❌ Subscribe error:', error);
        return () => {};
      }
    },
    []
  );

  //* ==================== SEND MESSAGE ====================
  const sendMessage = useCallback(
    (destination: string, body: object) => {
      if (!clientRef.current || !isConnected) {
        console.warn('⚠️ Cannot send: Not connected');
        return;
      }

      try {
        clientRef.current.publish({
          destination,
          body: JSON.stringify(body),
        });
        console.log(`📤 Sent to ${destination}`);
      } catch (error) {
        console.error('❌ Send error:', error);
      }
    },
    [isConnected]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  //* ==================== REQUEST PERMISSION ====================
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, []);

  const value: StompWebSocketContextType = {
    isConnected,
    notifications,
    connectWebSocket,
    disconnectWebSocket,
    subscribe,
    sendMessage,
    clearNotifications,
    requestNotificationPermission,
  };

  return <StompWebSocketContext.Provider value={value}>{children}</StompWebSocketContext.Provider>;
};
