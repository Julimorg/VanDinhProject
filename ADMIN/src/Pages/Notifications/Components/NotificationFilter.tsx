import { Button, Space } from 'antd';

interface Props {
  filter: 'all' | 'unread' | 'read';
  setFilter: (f: 'all' | 'unread' | 'read') => void;
  allCount: number;
  unreadCount: number;
  readCount: number;
}

const NotificationFilters: React.FC<Props> = ({ filter, setFilter, allCount, unreadCount, readCount }) => {
  return (
    <Space wrap>
      <Button type={filter === 'all' ? 'primary' : 'default'} onClick={() => setFilter('all')}>
        Tất cả ({allCount})
      </Button>
      <Button type={filter === 'unread' ? 'primary' : 'default'} onClick={() => setFilter('unread')}>
        Chưa đọc ({unreadCount})
      </Button>
      <Button type={filter === 'read' ? 'primary' : 'default'} onClick={() => setFilter('read')}>
        Đã đọc ({readCount})
      </Button>
    </Space>
  );
};

export default NotificationFilters;