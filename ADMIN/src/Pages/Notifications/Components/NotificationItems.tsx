import { Card, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { IGetAllNotifications } from '@/Interface/Notification/IGetAllNotification';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text } = Typography;

interface Props {
  item: IGetAllNotifications;
}

const NotificationItem: React.FC<Props> = ({ item }) => {
  const isUnread = !item.isRead;

  const colorMap: Record<string, string> = {
    ORDER: '#1890ff',
    PRODUCT: '#52c41a',
    SYSTEM: '#fa8c16',
    WARNING: '#faad14',
    ERROR: '#ff4d4f',
    SUCCESS: '#52c41a',
  };
  const color = colorMap[item.type] || '#1890ff';

  return (
    <Card
      className={`mb-4 transition-all ${isUnread
        ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-md'
        : 'bg-white opacity-70 border-l--300'
      }`}
      hoverable
    >
      <div className="flex gap-4">
        <div
          className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${isUnread ? 'opacity-100' : 'opacity-50'}`}
          style={{ background: color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Text strong className={`text-base ${isUnread ? 'text-gray-900' : 'text-gray-600'}`} style={isUnread ? { color } : {}}>
                  {item.title}
                </Text>
                <Tag color={isUnread ? 'blue' : 'default'}>{item.type}</Tag>
              </div>
              <Text className={`text-sm block ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
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
};

export default NotificationItem;