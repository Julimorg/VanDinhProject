import { Pagination } from 'antd';

interface Props {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const NotificationPagination: React.FC<Props> = ({ current, total, pageSize, onChange }) => {
  return (
    <div className="mt-6 flex justify-center">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  );
};

export default NotificationPagination;