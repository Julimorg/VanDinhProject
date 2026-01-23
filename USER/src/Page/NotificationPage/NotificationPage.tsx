import React, { useMemo, useState } from 'react';
import { Card, Badge, Empty, Button, Segmented, Pagination } from 'antd';
import { BellOutlined, CheckCircleOutlined, CheckOutlined, MailOutlined } from '@ant-design/icons';
import type { NotificationType } from '../../Interface/Notification/INotification';
import { useGetAllNotifications } from './Hook/useGetAllNotifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMarkNotificationAsRead } from '../../Components/Header/Hook/useMarkNotificationAsRead';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

dayjs.extend(relativeTime);

const PAGE_SIZE = 10;

const NotificationPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);

  const { id } = useAuthStore();
  const userId = id ?? undefined;

  const markAsRead = useMarkNotificationAsRead(userId);

  const queryParams = useMemo(() => {
    const params: any = {
      page: page - 1,
      size: PAGE_SIZE,
    };

    if (filter === 'read') params.isRead = true;
    if (filter === 'unread') params.isRead = false;

    return params;
  }, [filter, page]);

  const { data, isLoading } = useGetAllNotifications(userId, queryParams);

  const { data: allRes } = useGetAllNotifications(
    userId,
    { page: 0, size: 1 },
    { staleTime: 60_000 }
  );

  const { data: unreadRes } = useGetAllNotifications(
    userId,
    { isRead: false, page: 0, size: 1 },
    { staleTime: 60_000 }
  );

  const notifications: NotificationType[] = useMemo(() => {
    if (!Array.isArray(data?.data?.content)) return [];

    return data.data.content.map((item) => ({
      id: item.userNotificationId,
      title: item.title,
      description: item.message,
      time: dayjs(item.createdAt).fromNow(),
      read: item.isRead,
      type: item.type.toLowerCase(),
    }));
  }, [data?.data?.content]);

  const totalAll = allRes?.data?.page.totalElements ?? 0;
  const totalUnread = unreadRes?.data?.page.totalElements ?? 0;
  const totalRead = Math.max(totalAll - totalUnread, 0);

  const handleMarkAllRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (!unreadIds.length) return;

    unreadIds.forEach((id) => {
      markAsRead.mutate(
        { userNotificationId: id, body: { isRead: true } },
        {
          onSuccess: () => {
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
          },
        }
      );
    });
  };

  const handleMarkOneRead = (id: string) => {
    markAsRead.mutate({
      userNotificationId: id,
      body: { isRead: true },
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-blue-100 text-blue-700',
      system: 'bg-orange-100 text-orange-700',
      product: 'bg-indigo-100 text-indigo-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      success: 'bg-green-100 text-green-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: 'Đơn hàng',
      system: 'Hệ thống',
      product: 'Sản phẩm',
      warning: 'Cảnh báo',
      error: 'Lỗi',
      success: 'Thành công',
    };
    return labels[type] || 'Khác';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BellOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Thông báo</h1>
                <p className="text-sm text-gray-600">
                  {totalUnread > 0
                    ? `${totalUnread} thông báo chưa đọc`
                    : 'Không có thông báo mới'}
                </p>
              </div>
            </div>

            <Button
              icon={<CheckOutlined />}
              onClick={handleMarkAllRead}
              disabled={totalUnread === 0}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          </div>

          <div className="mt-5">
            <Segmented
              value={filter}
              onChange={(v) => {
                setFilter(v as any);
                setPage(1);
              }}
              block
              options={[
                { label: <>Tất cả <Badge count={totalAll} /></>, value: 'all' },
                { label: <>Chưa đọc <Badge count={totalUnread} /></>, value: 'unread' },
                { label: <>Đã đọc <Badge count={totalRead} /></>, value: 'read' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isLoading ? (
          <Card><Empty description="Đang tải thông báo..." /></Card>
        ) : notifications.length === 0 ? (
          <Card><Empty description="Không có thông báo" /></Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`rounded-xl ${!n.read ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className={`w-3 h-3 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-600'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{n.title}</h3>

                      <div className="flex items-center gap-2">
                        {/* Type badge */}
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(n.type)}`}>
                          {getTypeLabel(n.type)}
                        </span>

                        {/* Mark as read icon */}
                        {!n.read && (
                          <CheckCircleOutlined
                            title="Đánh dấu đã đọc"
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            onClick={() => handleMarkOneRead(n.id)}
                          />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{n.description}</p>

                    <div className="flex justify-between mt-3">
                      <span className="text-xs text-gray-500">{n.time}</span>

                      {!n.read && (
                        <Button
                          type="text"
                          size="small"
                          icon={<MailOutlined />}
                          onClick={() => handleMarkOneRead(n.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalAll > PAGE_SIZE && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={totalAll}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
