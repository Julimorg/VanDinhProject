import React, { useState, useMemo } from 'react';
import { Dropdown, List, Button, Spin, Empty } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { useGetNotifications } from '../Hook/useGetNotifications';
import { IGetNotificationResponse } from '@/Interface/Notification/IGetNotification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';
import { useMarkAllNotificationsAsRead } from '../Hook/useMarkAllNotificationsAsRead';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface NotificationDropdownProps {
  isMobile: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isMobile }) => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.id);
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useGetNotifications(userId || undefined, {
    enabled: !!userId && open,
  });

  const markAsRead = useMarkAllNotificationsAsRead();

  const notifications: IGetNotificationResponse[] = useMemo(() => {
    if (!data?.data) return [];

    const list = Array.isArray(data.data) ? data.data : [data.data];

    return [...list].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }, [data]);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const handleMarkAllAsRead = () => {
    if (userId && unreadNotifications.length > 0) {
      unreadNotifications.forEach((noti) => {
        markAsRead.mutate(
          {
            userNotificationId: noti.userNotificationId,
            body: { isRead: true },
          },
          {
            onSuccess: () => {
              toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
              refetch();
            },
            onError: (err: any) => {
              toast.error(`Đánh dấu thất bại: ${err.message || 'Vui lòng thử lại!'}`);
            },
          }
        );
      });


    }
  };



  const getNotificationColor = (type: string) => {
    const colorMap: Record<string, string> = {
      ORDER: '#1890ff',
      PRODUCT: '#52c41a',
      SYSTEM: '#fa8c16',
      WARNING: '#faad14',
      ERROR: '#ff4d4f',
      SUCCESS: '#52c41a',
    };
    return colorMap[type] || '#1890ff';
  };

  const formatTime = (dateString: string) => dayjs(dateString).fromNow();

  const notificationMenu = (
    <div className={`${isMobile ? 'w-80' : 'w-96'} max-h-[450px] overflow-auto bg-white rounded-lg shadow-2xl`}>
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-base font-semibold">Thông báo</span>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            className="p-0 h-auto text-xs"
          >
            Đánh dấu xem tất cả
          </Button>
        )}
      </div>

      <Spin spinning={isLoading}>
        {notifications.length === 0 ? (
          <div className="py-8">
            <Empty description="Không có thông báo nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => {
              const isUnread = !item.isRead;
              const notificationColor = getNotificationColor(item.type);

              return (
                <div
                  className={`px-4 py-3 cursor-pointer transition-all border-b border-gray-50 ${isUnread
                    ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500'
                    : 'bg-white hover:bg-gray-50 opacity-70'
                    }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isUnread ? 'opacity-100' : 'opacity-50'}`}
                      style={{ background: notificationColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span
                          className={`font-semibold text-sm ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}
                          style={isUnread ? { color: notificationColor } : {}}
                        >
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm m-0 ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}
      </Spin>

      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <button
          onClick={() => navigate('/notifications')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => notificationMenu}
      placement="bottomRight"
      trigger={['click']}
      overlayStyle={{ paddingTop: 8 }}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="relative cursor-pointer">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <BellOutlined className="text-xl text-gray-600" />
        </button>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
