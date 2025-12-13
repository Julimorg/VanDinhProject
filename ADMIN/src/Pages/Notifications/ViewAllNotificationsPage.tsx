import React, { useState, useMemo } from 'react';
import { Card, List, Typography, Spin, Empty, Tag, Button, Space, Row, Col } from 'antd';
import { CheckOutlined, BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { useGetNotifications } from '@/Pages/Dashboard/Header/Hook/useGetNotifications';
import { IGetNotificationResponse } from '@/Interface/Notification/IGetNotification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useMarkAllNotificationsAsRead } from '@/Pages/Dashboard/Header/Hook/useMarkAllNotificationsAsRead';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;

const ViewAllNotificationsPage: React.FC = () => {
  const userId = useAuthStore((state) => state.id);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data, isLoading, refetch } = useGetNotifications(userId || undefined, {
    enabled: !!userId,
  });

  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead({
    onSuccess: () => {
      refetch();
    },
  });

  // Handle response - could be array or single object
  const allNotifications: IGetNotificationResponse[] = useMemo(() => {
    if (!data?.data) return [];
    if (Array.isArray(data.data)) {
      return data.data;
    }
    return [data.data];
  }, [data]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return allNotifications;
    if (filter === 'unread') return allNotifications.filter((noti) => !noti.isRead);
    return allNotifications.filter((noti) => noti.isRead);
  }, [allNotifications, filter]);

  const unreadCount = allNotifications.filter((noti) => !noti.isRead).length;

  const handleMarkAllAsRead = () => {
    if (userId && unreadCount > 0) {
      markAllAsRead(userId);
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

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const formatRelativeTime = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Title level={2} className="!mb-2 flex items-center gap-2">
                <BellOutlined />
                Tất cả thông báo
              </Title>
              <Text type="secondary" className="text-sm sm:text-base">
                Quản lý và xem tất cả thông báo của bạn
              </Text>
            </div>
            {unreadCount > 0 && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
                loading={isMarkingAll}
                size="large"
              >
                Đánh dấu xem tất cả ({unreadCount})
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={8}>
              <Space wrap>
                <Button
                  type={filter === 'all' ? 'primary' : 'default'}
                  onClick={() => setFilter('all')}
                >
                  Tất cả ({allNotifications.length})
                </Button>
                <Button
                  type={filter === 'unread' ? 'primary' : 'default'}
                  onClick={() => setFilter('unread')}
                >
                  Chưa đọc ({unreadCount})
                </Button>
                <Button
                  type={filter === 'read' ? 'primary' : 'default'}
                  onClick={() => setFilter('read')}
                >
                  Đã đọc ({allNotifications.length - unreadCount})
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Notifications List */}
          <Spin spinning={isLoading}>
            {filteredNotifications.length === 0 ? (
              <div className="py-12">
                <Empty
                  description={
                    filter === 'all'
                      ? 'Không có thông báo nào'
                      : filter === 'unread'
                      ? 'Không có thông báo chưa đọc'
                      : 'Không có thông báo đã đọc'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={filteredNotifications}
                renderItem={(item) => {
                  const isUnread = !item.isRead;
                  const notificationColor = getNotificationColor(item.type);

                  return (
                    <Card
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
                          style={{ background: notificationColor }}
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
                                  style={isUnread ? { color: notificationColor } : {}}
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
                                {formatTime(item.createdAt)}
                              </Text>
                              <Text type="secondary" className="text-xs">
                                {formatRelativeTime(item.createdAt)}
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
          </Spin>
        </Space>
      </Card>
    </div>
  );
};

export default ViewAllNotificationsPage;

