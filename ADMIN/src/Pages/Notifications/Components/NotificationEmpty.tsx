import { Empty } from 'antd';

const NotificationEmpty: React.FC = () => (
  <div className="py-12">
    <Empty description="Không có thông báo nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
);

export default NotificationEmpty;