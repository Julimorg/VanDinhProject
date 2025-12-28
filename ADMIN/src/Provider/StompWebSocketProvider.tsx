
import { useEffect } from 'react';
import { useWebSocketService } from '../Hook/useWebSocket';
import { useAuthStore } from '@/Store/IAuth';
import { useOnlineStatusStore } from '@/Store/useOnlineStatusStore'; 
import { LOCAL_API_RAW } from '@/Utils/env_dev_handler';
import { toast } from 'react-toastify';

const GlobalWebSocketListener = () => {
  const { id: userId, accessToken } = useAuthStore();
  const updateUserStatus = useOnlineStatusStore((state) => state.updateUserStatus);
  const clearAll = useOnlineStatusStore((state) => state.clearAll);

  const LOCAL_API = LOCAL_API_RAW;
  const { connect, subscribe, disconnect, isConnected } = useWebSocketService(
    LOCAL_API + '/ws',
    () => {
      console.log('🎯 WebSocket Connected - Setting up subscriptions...');
      toast.success('🔔 Kết nối realtime thành công!');

      // Private notifications
      subscribe('/user/queue/notifications', (msg) => {
        console.log('🔔 Private Notification received:', msg);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(msg.title || 'New Notification', {
            body: msg.message,
            icon: '/notification-icon.png',
          });
        }

        toast.info(msg.message);
      });

      // Public notifications
      subscribe('/topic/public-notifications', (msg) => {
        console.log('📢 Public Notification received:', msg);
        toast.info(msg.message);
      });

      // Admin broadcast
      subscribe('/topic/admin-broadcast', (msg) => {
        console.log('📣 Admin Broadcast received:', msg);
        toast.warning(msg.message);
      });

      // 🔥 Online status - LƯU VÀO STORE
      subscribe('/topic/online-status', (status) => {
        console.log('👤 User status changed:', status);
        
        // Lưu vào Zustand store
        updateUserStatus(status);
        
        const isOnline = status.socketId !== null;
        const name = status.userName || status.userId;
        console.log(`${isOnline ? '🟢' : '⚪'} ${name} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      });
    },
    (error) => {
      console.error('❌ WebSocket Error:', error);
      toast.error('Kết nối bị gián đoạn. Đang thử lại...');
    }
  );

  useEffect(() => {
    if (userId && accessToken) {
      console.log('🔄 Attempting to connect WebSocket...');
      connect(accessToken);
    }

    return () => {
      if (!accessToken) {
        console.log('⚠️ No token, disconnecting WebSocket...');
        disconnect();
        clearAll(); // 🔥 Clear store khi logout
      }
    };
  }, [userId, accessToken, connect, disconnect, clearAll]);

  useEffect(() => {
    console.log('🔌 WebSocket status:', isConnected ? 'CONNECTED' : 'DISCONNECTED');
  }, [isConnected]);

  return null;
};

export default GlobalWebSocketListener;