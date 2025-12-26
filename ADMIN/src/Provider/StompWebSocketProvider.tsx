import { IGetUserOnlineStatus } from '@/Interface/Notification/IGetUserOnlineStatus';
import { useAuthStore } from '@/Store/IAuth';
import {
  LOCAL_API_RAW,
  WEBSOCKET_CHANNEL_NOTIFICATIONS,
  WEBSOCKET_CHANNEL_ONLINE_STATUS,
  WEBSOCKET_TAIL,
} from '@/Utils/env_dev_handler';
import { Client } from '@stomp/stompjs';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';


export interface StompWebSocketContextType {
  isConnected: boolean;
  notifications: any[];
  onlineStatuses: Map<string, IGetUserOnlineStatus>; // Map<userId, UserOnlineStatus>
  getUserOnlineStatus: (userId: string) => IGetUserOnlineStatus | undefined;
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  subscribe: (destination: string, callback: (data: any) => void) => () => void;
  sendMessage: (destination: string, body: any) => void;
  clearNotifications: () => void;
  requestNotificationPermission: () => void;
}

const StompWebSocketContext = createContext<StompWebSocketContextType | null>(null);


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
  const [onlineStatuses, setOnlineStatuses] = useState<Map<string, IGetUserOnlineStatus>>(new Map());
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef(new Map());
  const isConnectingRef = useRef(false); // Track đang trong quá trình connect
  const accessTokenRef = useRef<string | null>(null); // Track token để tránh connect lại khi token không đổi

  const LOCAL_API = LOCAL_API_RAW;
  const WS_TAIL = WEBSOCKET_TAIL;
  const WS_NOTI_CHANNEL = WEBSOCKET_CHANNEL_NOTIFICATIONS;
  const WS_ONLINE_STATUS = WEBSOCKET_CHANNEL_ONLINE_STATUS

  const accessToken = useAuthStore((state) => state.accessToken);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  //* ==================== SUBSCRIBE CHANNEL  ====================

  //? Subscribe Notifications Channel
  const subscribeToNotifications = useCallback(() => {
    // Check bằng clientRef.current?.connected thay vì isConnected (vì setState async)
    if (!clientRef.current?.connected) {
      console.warn('⚠️ Cannot subscribe: Client not connected');
      return;
    }

    try {
      // Unsubscribe cũ nếu có (tránh duplicate subscription)
      const oldSub = subscriptionsRef.current.get('notifications');
      if (oldSub) {
        oldSub.unsubscribe();
      }

      console.info('📡 Subscribing to:', WS_NOTI_CHANNEL);

      const subscription = clientRef.current.subscribe(`${WS_NOTI_CHANNEL}`, (message) => {
        try {
          const notification = JSON.parse(message.body);

          console.info('🔔 New notification:', notification);

          setNotifications((prev) => [notification, ...prev].slice(0, 100));

          //? Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title || 'New Notification', {
              body: notification.message,
              icon: '/notification-icon.png',
            });
          }
        } catch (error) {
          console.error('❌ Parse notification error:', error);
        }
      });

      subscriptionsRef.current.set('notifications', subscription);
      console.info('✅ Subscribed to notifications successfully');
    } catch (error) {
      console.error('❌ Subscribe error:', error);
    }
  }, [WS_NOTI_CHANNEL]);


  //? Subscribe Online Status Channel
  const subscribeToOnlineStatus = useCallback(() => {
  if (!clientRef.current?.connected) {
    console.warn(' Cannot subscribe: Client not connected');
    return;
  }

  try {
    const oldSub = subscriptionsRef.current.get('onlineStatus');
    if (oldSub) {
      oldSub.unsubscribe();
    }

    console.info(' Subscribing to online status channel:', WS_ONLINE_STATUS);

    const subscription = clientRef.current.subscribe(`${WS_ONLINE_STATUS}`, (message) => {
      try {
        // BE gửi trực tiếp GetUserIsOnline DTO
        const user: IGetUserOnlineStatus = JSON.parse(message.body);
        
        console.info('📨 Received WebSocket message:', user);

        const isOnline = user.socketId !== null && user.socketId !== undefined;

        console.info('👤 User status changed:', {
          userId: user.userId,
          socketId: user.socketId,
          isOnline: isOnline,
          lastSeen: user.lastSeen,
        });

        // Update online statuses map
        setOnlineStatuses((prev) => {
          const newMap = new Map(prev);
          newMap.set(user.userId, user);
          return newMap;
        });

        // Optional: Log status change
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || user.userId;
        console.log(`${isOnline ? '🟢' : '⚪'} ${name} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

      } catch (error) {
        console.error('❌ Parse online status error:', error);
      }
    });

    subscriptionsRef.current.set('onlineStatus', subscription);
    console.info('✅ Subscribed to online status successfully');
  } catch (error) {
    console.error('❌ Subscribe online status error:', error);
  }
}, [WS_ONLINE_STATUS]);
  //* ==================== CONNECT ====================
  const connectWebSocket = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous connection attempts
      if (isConnectingRef.current) {
        console.log('⏳ Connection already in progress, skipping...');
        resolve();
        return;
      }

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
        console.log('✅ WebSocket already connected');
        resolve();
        return;
      }

      // Cleanup client cũ nếu có (chưa connected nhưng vẫn tồn tại)
      if (clientRef.current && !clientRef.current.connected) {
        console.log('🧹 Cleaning up old client...');
        try {
          clientRef.current.deactivate();
        } catch (e) {
          console.warn('Error cleaning up old client:', e);
        }
        clientRef.current = null;
      }

      isConnectingRef.current = true;
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
          console.info('✅ STOMP Connected! ', frame);
          isConnectingRef.current = false;
          setIsConnected(true);
          accessTokenRef.current = accessToken; // Lưu token hiện tại

          // Subscribe notifications và online status sau khi connected
          subscribeToNotifications();
          subscribeToOnlineStatus();

          resolve();
        },

        onDisconnect: (frame) => {
          console.info('🔌 STOMP Disconnected! ', frame);
          isConnectingRef.current = false;
          setIsConnected(false);
          subscriptionsRef.current.clear();
        },

        //* ==> Debug and Catch Error

        onStompError: (frame) => {
          console.error('❌ STOMP Error : ', frame);
          isConnectingRef.current = false;

          //? Nếu lỗi authentication → logout
          if (frame.headers.message?.includes('401') || frame.headers.message?.includes('403')) {
            console.error('🚫 Authentication error, logging out...');
            clearTokens();
          }

          reject(new Error(frame.headers.message));
        },

        onWebSocketError: (frame) => {
          console.error('❌ WebSocket Error : ', frame);
          isConnectingRef.current = false;
          reject(frame);
        },
      });

      client.activate();
      clientRef.current = client;
    });
  }, [accessToken, clearTokens, LOCAL_API, WS_TAIL, subscribeToNotifications, subscribeToOnlineStatus]);

  //* ==================== AUTO CONNECT KHI CÓ TOKEN ====================
  useEffect(() => {
    // Chỉ connect khi:
    // 1. Có token
    // 2. Chưa connected
    // 3. Token thay đổi (không phải lần đầu mount với cùng token)
    // 4. Không đang trong quá trình connect
    if (
      accessToken &&
      !isConnected &&
      !isConnectingRef.current &&
      accessToken !== accessTokenRef.current
    ) {
      console.log('🔄 Tự động kết nối WebSocket vì có token mới');
      connectWebSocket().catch((err) => {
        console.error('❌ Auto connect failed:', err);
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
      accessTokenRef.current = null;
    }
  }, [accessToken, disconnectWebSocket]);

  //* ==================== CLEANUP KHI UNMOUNT ====================
  useEffect(() => {
    return () => {
      // Cleanup khi component unmount
      if (clientRef.current) {
        console.log('🧹 Cleaning up WebSocket on unmount...');
        try {
          clientRef.current.deactivate();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
        subscriptionsRef.current.clear();
        clientRef.current = null;
      }
    };
  }, []);
  

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

  //* ==================== GET USER ONLINE STATUS ====================
  const getUserOnlineStatus = useCallback((userId: string): IGetUserOnlineStatus | undefined => {
    return onlineStatuses.get(userId);
  }, [onlineStatuses]);

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
    onlineStatuses,
    getUserOnlineStatus,
    connectWebSocket,
    disconnectWebSocket,
    subscribe,
    sendMessage,
    clearNotifications,
    requestNotificationPermission,
  };

  return <StompWebSocketContext.Provider value={value}>{children}</StompWebSocketContext.Provider>;
};
