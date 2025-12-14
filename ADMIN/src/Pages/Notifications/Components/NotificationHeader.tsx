import { Button, Typography } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
  isMarkingAll: boolean;
}

const NotificationHeader: React.FC<Props> = ({ unreadCount, onMarkAllRead, isMarkingAll }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Title level={2} className="!mb-2 flex items-center gap-2">
          <BellOutlined />
          Tất cả thông báo
        </Title>
        <Text type="secondary">Quản lý và xem tất cả thông báo của bạn</Text>
      </div>

      {unreadCount > 0 && (
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={onMarkAllRead}
          loading={isMarkingAll}
          size="large"
        >
          Đánh dấu tất cả đã đọc ({unreadCount})
        </Button>
      )}
    </div>
  );
};

export default NotificationHeader;