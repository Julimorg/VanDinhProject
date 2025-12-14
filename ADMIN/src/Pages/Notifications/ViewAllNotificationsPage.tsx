
import React, { useState } from 'react';
import { useAuthStore } from '@/Store/IAuth';
import { useMarkAllNotificationsAsRead } from '@/Pages/Dashboard/Header/Hook/useMarkAllNotificationsAsRead';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useGetAllNotifications } from './Hook/userGetAllNotifications';

import { Card, List, Skeleton, Space, Tag, Typography } from 'antd';
import NotificationHeader from './Components/NotificationHeader';
import NotificationFilters from './Components/NotificationFilter';
import NotificationEmpty from './Components/NotificationEmpty';
import NotificationPagination from './Components/NotificationPagination';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text } = Typography;

const ViewAllNotificationsPage: React.FC = () => {
  const userId = useAuthStore((state) => state.id);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState<number>(0); 
  const [size] = useState<number>(10);

  const { data, isLoading, refetch } = useGetAllNotifications(
    userId || '',
    { page, size, sort: 'deliveredAt,desc' },
    { enabled: !!userId }
  );

  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead({
    onSuccess: () => refetch(),
  });

  const notifications = data?.data?.content || [];
  const pagination = data?.data?.page;

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item: any) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'read') return item.isRead;
    return true;
  });

  const handleMarkAllAsRead = () => {
    if (userId && unreadCount > 0) {
      markAllAsRead(userId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Hàm lấy màu theo type
  const getNotificationColor = (type: string) => {
    const map: Record<string, string> = {
      ORDER: '#1890ff',
      PRODUCT: '#52c41a',
      SYSTEM: '#fa8c16',
      WARNING: '#faad14',
      ERROR: '#ff4d4f',
      SUCCESS: '#52c41a',
    };
    return map[type] || '#1890ff';
  };

  // Skeleton Item giống hệt cấu trúc thật
  const SkeletonNotificationItem = () => (
    <Card className="mb-4" bodyStyle={{ padding: '16px' }}>
      <div className="flex gap-4">
        {/* Chấm màu */}
        <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0">
          <Skeleton.Avatar active shape="circle" size={12} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {/* Tiêu đề + Tag */}
              <div className="flex items-center gap-2 mb-2">
                <Skeleton.Input active style={{ width: 280, height: 20 }} />
                <Skeleton.Button active size="small" style={{ width: 70 }} />
              </div>
              {/* Nội dung */}
              <Skeleton paragraph={{ rows: 2, width: ['100%', '85%'] }} active />
            </div>
            {/* Thời gian */}
            <div className="text-right">
              <Skeleton.Input active style={{ width: 130 }} />
              <br />
              <Skeleton.Input active style={{ width: 90, marginTop: 6 }} />
            </div>
          </div>
          {/* Tạo bởi */}
          <div className="mt-3">
            <Skeleton.Input active style={{ width: 160 }} />
          </div>
        </div>
      </div>
    </Card>
  );

  // Hiển thị 6 skeleton khi đang loading
  const loadingSkeletons = Array.from({ length: 6 }).map((_, index) => (
    <SkeletonNotificationItem key={index} />
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllRead={handleMarkAllAsRead}
            isMarkingAll={isMarkingAll}
          />

          {/* Filters */}
          <NotificationFilters
            filter={filter}
            setFilter={setFilter}
            allCount={notifications.length}
            unreadCount={unreadCount}
            readCount={notifications.length - unreadCount}
          />

          {/* Danh sách thông báo hoặc skeleton hoặc empty */}
          {isLoading ? (
            <div>{loadingSkeletons}</div>
          ) : filteredNotifications.length === 0 ? (
            <NotificationEmpty />
          ) : (
            <List
              dataSource={filteredNotifications}
              renderItem={(item: any) => {
                const isUnread = !item.isRead;
                const color = getNotificationColor(item.type);

                return (
                  <Card
                    key={item.userNotificationId}
                    className={`mb-4 transition-all ${
                      isUnread
                        ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-md'
                        : 'bg-white opacity-70 border-l-4 border-l-gray-300'
                    }`}
                    hoverable
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                          isUnread ? 'opacity-100' : 'opacity-50'
                        }`}
                        style={{ background: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Text
                                strong
                                className={`text-base ${
                                  isUnread ? 'text-gray-900' : 'text-gray-600'
                                }`}
                                style={isUnread ? { color } : {}}
                              >
                                {item.title}
                              </Text>
                              <Tag color={isUnread ? 'blue' : 'default'}>
                                {item.type}
                              </Tag>
                            </div>
                            <Text
                              className={`text-sm block ${
                                isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'
                              }`}
                            >
                              {item.message}
                            </Text>
                          </div>
                          <div className="text-right">
                            <Text type="secondary" className="text-xs block">
                              {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {dayjs(item.createdAt).fromNow()}
                            </Text>
                          </div>
                        </div>
                        {item.createBy && (
                          <Text type="secondary" className="text-xs">
                            Tạo bởi: {item.createBy}
                          </Text>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              }}
            />
          )}

    
          {!isLoading && pagination && pagination.totalPages > 1 && (
            <NotificationPagination
              current={page}
              total={pagination.totalElements}
              pageSize={pagination.size}
              onChange={handlePageChange}
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default ViewAllNotificationsPage;