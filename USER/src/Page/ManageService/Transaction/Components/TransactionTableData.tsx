import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ResSearchTicker } from '@/Interface/TSearchTicket';

const { Text } = Typography;

interface TransactionTableDataProps {
  data: ResSearchTicker[];
  isLoading: boolean;
}

const TransactionTableData = ({ data, isLoading }: TransactionTableDataProps) => {
  const navigate = useNavigate();

  const columns: ColumnsType<ResSearchTicker> = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'cart_id',
      key: 'cart_id',
      sorter: (a, b) => (a.cart_id || '').localeCompare(b.cart_id || ''),
      render: (id) => id || 'N/A',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customer_phone_number',
      key: 'customer_phone_number',
      sorter: (a, b) =>
        (a.customer_phone_number || '').localeCompare(b.customer_phone_number || ''),
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'customer_email',
      key: 'customer_email',
      sorter: (a, b) => (a.customer_email || '').localeCompare(b.customer_email || ''),
      render: (email) => email || 'N/A',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: (a, b) => (a.customer_name || '').localeCompare(b.customer_name || ''),
      render: (name) => name || 'N/A',
    },
    {
      title: 'Thời gian',
      dataIndex: 'create_at',
      key: 'create_at',
      sorter: (a, b) =>
        new Date(a.create_at || '').getTime() - new Date(b.create_at || '').getTime(),
      render: (time) => (time ? new Date(time).toLocaleString('vi-VN') : 'N/A'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      sorter: (a, b) => (a.total_price || 0) - (b.total_price || 0),
      render: (amount) =>
        amount
          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
          : 'N/A',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'method',
      key: 'method',
      render: (method) => {
        const displayText =
          method?.toLowerCase() === 'cash'
            ? 'Tiền mặt'
            : method?.toLowerCase() === 'momo'
            ? 'Momo'
            : 'N/A';
        return (
          <Tag color={method?.toLowerCase() === 'cash' ? 'blue' : 'purple'}>{displayText}</Tag>
        );
      },
      filters: [
        { text: 'Tiền mặt', value: 'cash' },
        { text: 'Momo', value: 'momo' },
      ],
      onFilter: (value, record) => record.method?.toLowerCase() === value,
    },
    {
      title: 'Hình thức',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          title="Xem chi tiết"
          onClick={() => navigate(`/transaction-detail/${record.cart_id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quản lý giao dịch</h2>
      </div>

      {!data.length && !isLoading && (
        <Text type="secondary" className="block mb-4">
          Chưa có dữ liệu giao dịch. Vui lòng tìm kiếm để hiển thị.
        </Text>
      )}

      <Table
        columns={columns}
        dataSource={data}
        rowKey="cart_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
        loading={isLoading}
      />
    </div>
  );
};

export default TransactionTableData;
