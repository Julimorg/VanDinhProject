import React, { createContext, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/Store/IAuth';
import { toast } from 'react-toastify';
import { subscribe } from 'diagnostics_channel';
import { WEBSOCKET_CHANNEL_NOTIFICATIONS } from '@/Utils/env_dev_handler';


interface StompWebSocketContextType {
  isConnected: boolean;
  notifications: any[];
  connectWebSocket: () => Promise<unknown>;
  disconnectWebSocket: () => void;
  subscribe: (name: string | symbol, onMessage: any) => void;
  sendMessage: (destination: string, body: object) => void;
  clearNotifications: () => void;
}

const StompWebSocketContext = createContext<StompWebSocketContextType | null>(null);

export const StompWebSocketProvider = ({ children, url, wsEndpoint }:
     { children: React.ReactNode; url: string; wsEndpoint: string }) => {

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef(new Map());

  //* ==================== CONNECT ====================

  const connectWebSocket = useCallback(() => {
    return new Promise((resolve, reject) => {
        
      //! TUYỆT ĐỐI KHÔNG ĐƯỢC XÓA ĐOẠN COMMENT REMOVE ESLINT NÀY
      //!  -> DO TÍNH RULE CỦA HOOK LUÔN ƯU TIÊN ĐẶT CAO NHẤT
      //!  -> NÊN VIỆC DECLARE HOOK TRONG FUNCTION NÀY VI PHẠM ESLINT RULE
      //!  -> NHƯNG MÀ ĐẶT CŨNG KHÔNG VẤN ĐỀ GÌ NHƯNG PHẢI DISABLED RULE ESLINT NÀY ĐỂ KHÔNG BỊ TIỀM ẨN BUG
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const accessToken = useAuthStore((state) => state.accessToken);

      if (!accessToken) {
        toast.warn('Something went wrong! Please try again later!');
        console.warn('⚠️ No access token. Cannot connect WebSocket.');
        reject(new Error('Something went wrong! Please try again later! '));
        return;
      }

      //? Check xem đã connect rồi thì ko cần connect lại
      if (clientRef.current?.connected) {
        console.log(' WebSocket already connected');
        resolve(undefined);
        return;
      }

      console.log('🔄 Connecting STOMP WebSocket...');

      const client = new Client({
        webSocketFactory: () => new SockJS(`${url}${wsEndpoint}`),

        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },

        debug: (str) => {
          console.info('Debug log WS: ', str);
        },

        reconnectDelay: 5000, // Auto reconnect sau 5s
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        //? Bắt đầu Connect vào những Channel mà Server đã tạo
        onConnect: (frame) => {
          console.info('STOMP Connected! ', frame);
          setIsConnected(true);

          // subscribeToNotifications();

          resolve(frame);
        },

        onDisconnect: (frame) => {
          console.info('STOMP Disconnected! ', frame);

          setIsConnected(true);

          subscriptionsRef.current.clear();
        },

        //* ==> Debug and Catch Error

        onStompError: (frame) => {
          console.error('STOMP Error : ', frame);
          reject(frame);
        },

        onWebSocketError: (frame) => {
          console.error('WebSocket Error : ', frame);
          reject(frame);
        },
      });

      client.activate();
      clientRef.current = client;
    });
  }, [url, wsEndpoint]);

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

  //* ==================== SUBSCRIBE CHANNEL ====================

  //? Subscribe Notifications
  const subscribeToNotifications = useCallback(() => {
    if (!clientRef.current || !isConnected) return;

    try {
      console.info('Subscribing to /user/queue/notifications');

      const subscription = clientRef.current.subscribe(
        `${WEBSOCKET_CHANNEL_NOTIFICATIONS}`,
        (message) => {
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
        }
      );

      subscriptionsRef.current.set('notifications', subscription);
    } catch (error) {
      console.error('Subscribe error:', error);
    }
  }, [isConnected]);

  //? Generic subscribe Template
  //   const GenericSubscribe = useCallback(
  //     (destination, callback) => {
  //       if (!clientRef.current || !isConnected) {
  //         console.warn('⚠️ Cannot subscribe: Not connected');
  //         return () => {};
  //       }

  //       try {
  //         const subscription = clientRef.current.subscribe(destination, (message) => {
  //           try {
  //             const data = JSON.parse(message.body);
  //             callback(data);
  //           } catch (error) {
  //             callback(message.body);
  //           }
  //         });

  //         subscriptionsRef.current.set(destination, subscription);

  //         return () => {
  //           subscription.unsubscribe();
  //           subscriptionsRef.current.delete(destination);
  //         };
  //       } catch (error) {
  //         console.error('❌ Subscribe error:', error);
  //         return () => {};
  //       }
  //     },
  //     [isConnected]
  //   );

  //? Send message
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

  const value = {
    isConnected,
    notifications,
    connectWebSocket,   
    subscribeToNotifications,   
    disconnectWebSocket,  
    subscribe,
    sendMessage,
    clearNotifications,
  };

   return (
    <StompWebSocketContext.Provider value={value}>
      {children}
    </StompWebSocketContext.Provider>
  );

};
