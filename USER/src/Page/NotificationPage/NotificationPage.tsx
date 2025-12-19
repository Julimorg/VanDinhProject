import React, { useMemo, useState } from 'react';
import { Card, Tabs, Badge, Empty, Button, Segmented } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons';
import type { NotificationType } from '../../Interface/Notification/INotification';
import { useGetAllNotifications } from './Hook/useGetAllNotifications';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const NotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { id: userId } = useAuthStoreCookiesStorage();
  const { data, isLoading } = useGetAllNotifications(userId || undefined);

  const notifications: NotificationType[] = useMemo(() => {
    if (!Array.isArray(data?.data?.content)) {
      return [];
    }

    return data.data.content.map((item) => ({
      id: item.userNotificationId,
      title: item.title,
      description: item.message,
      time: dayjs(item.createdAt).fromNow(),
      read: item.isRead,
      type: item.type.toLowerCase(),
    }));

  }, [data?.data?.content]);

  console.log('debug notifications: ', notifications);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-blue-100 text-blue-700',
      system: 'bg-orange-100 text-orange-700',
      payment: 'bg-green-100 text-green-700',
      comment: 'bg-purple-100 text-purple-700',
      promotion: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: 'Đơn hàng',
      system: 'Hệ thống',
      payment: 'Thanh toán',
      comment: 'Bình luận',
      promotion: 'Khuyến mãi',
    };
    return labels[type] || 'Khác';
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (filter === 'unread') return !notif.read;
      if (filter === 'read') return notif.read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BellOutlined className="text-xl sm:text-2xl text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Thông báo</h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
                  </p>
                </div>
              </div>

              {/* Actions - Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  icon={<CheckOutlined />}
                  className="hover:bg-gray-100"
                >
                  Đánh dấu tất cả đã đọc
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  type="text"
                  className="hover:bg-red-50"
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>

            {/* Filter Segmented */}
            <div className="mt-4 sm:mt-6">
              <Segmented
                value={filter}
                onChange={(value) => setFilter(value as 'all' | 'unread' | 'read')}
                options={[
                  {
                    label: (
                      <div className="px-2 sm:px-4 py-1">
                        <span className="text-sm font-medium">Tất cả</span>
                        <Badge
                          count={notifications.length}
                          className="ml-2"
                          style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                        />
                      </div>
                    ),
                    value: 'all',
                  },
                  {
                    label: (
                      <div className="px-2 sm:px-4 py-1">
                        <span className="text-sm font-medium">Chưa đọc</span>
                        <Badge
                          count={unreadCount}
                          className="ml-2"
                        />
                      </div>
                    ),
                    value: 'unread',
                  },
                  {
                    label: (
                      <div className="px-2 sm:px-4 py-1">
                        <span className="text-sm font-medium">Đã đọc</span>
                      </div>
                    ),
                    value: 'read',
                  },
                ]}
                block
                className="w-full"
              />
            </div>

            {/* Actions - Mobile */}
            <div className="flex sm:hidden items-center gap-2 mt-4">
              <Button
                icon={<CheckOutlined />}
                size="small"
                className="flex-1"
              >
                Đánh dấu đã đọc
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                type="text"
                size="small"
                className="flex-1"
              >
                Xóa tất cả
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {
          isLoading ? (<Card className="rounded-xl">
            <Empty description="Đang tải thông báo..." />
          </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="rounded-xl">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">Không có thông báo</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {filter === 'unread' && 'Bạn đã đọc hết thông báo'}
                      {filter === 'read' && 'Chưa có thông báo nào được đọc'}
                      {filter === 'all' && 'Bạn chưa có thông báo nào'}
                    </p>
                  </div>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer ${!notif.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Status Indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {!notif.read ? (
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-300 rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className={`text-sm sm:text-base font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                            {notif.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getTypeColor(notif.type)}`}>
                            {getTypeLabel(notif.type)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {notif.description}
                        </p>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs text-gray-500">{notif.time}</span>

                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <Button
                                type="text"
                                size="small"
                                icon={<MailOutlined />}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <span className="hidden sm:inline ml-1">Đánh dấu đã đọc</span>
                              </Button>
                            )}
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              danger
                              className="hover:bg-red-50"
                            >
                              <span className="hidden sm:inline ml-1">Xóa</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-6 sm:mt-8">
            <Button type="default" size="large" className="min-w-[200px]">
              Tải thêm thông báo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;