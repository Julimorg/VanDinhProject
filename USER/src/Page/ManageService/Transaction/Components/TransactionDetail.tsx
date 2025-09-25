import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, Table, Typography, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetTicketDetail } from '../Hooks/useGetTicketDetail';
import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatToVietnamTime } from '@/Utils';
// import { useAuthStore } from '@/Store/auth';
import type { TransactionDetailResponseData } from '@/Interface/TTransactionDetail';

const { Title, Text } = Typography;

const TransactionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { cart_id } = useParams<{ cart_id: string }>();
  const { data: ticket, isLoading, error } = useGetTicketDetail(cart_id);
  // const userName = useAuthStore((state) => state.userName);

  //   console.log('cartId:', cart_id);
  //   console.log('ticket:', ticket);
  //   console.log('customer_name:', ticket?.customer_name);

  if (!cart_id || cart_id.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Empty
          description={<Text type="danger">Lỗi: Mã giao dịch không hợp lệ</Text>}
          className="mb-4"
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/manageTransaction')}
        >
          Quay về
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!ticket || error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Empty
          description={<Text type="danger">Không tìm thấy dữ liệu vé</Text>}
          className="mb-4"
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/manageTransaction')}
        >
          Quay về
        </Button>
      </div>
    );
  }

  const displayPaymentMethod = (method?: string) => {
    if (!method) return 'N/A';
    return method.toLowerCase() === 'cash'
      ? 'Tiền mặt'
      : method.toLowerCase() === 'momo'
      ? 'Momo'
      : method;
  };

  const columns: ColumnsType<TransactionDetailResponseData> = [
    {
      title: 'Dịch vụ',
      dataIndex: 'service_name',
      key: 'payment_service',
      render: (value) => value || 'N/A',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'org_name',
      key: 'payment_org_name',
      render: (provider) => provider || 'Provider',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'payment_quantity',
      render: (value) => value || 0,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'service_price',
      key: 'payment_service_price',
      render: (value) => (value ? formatCurrency(value) : 'N/A'),
    },
    {
      title: 'Thành tiền',
      key: 'payment_total',
      render: (_, record) =>
        record.service_price && record.quantity
          ? formatCurrency(record.service_price * record.quantity)
          : 'N/A',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/manageTransaction')}
        className="mb-4"
      >
        Quay về
      </Button>
      <Title level={3} className="text-center mb-8">
        Chi tiết giao dịch: {ticket.cart_id || 'N/A'}
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin khách hàng */}
        <Card
          title="Thông tin khách hàng"
          variant="borderless"
          className="shadow-sm border border-gray-200"
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên">{ticket.customer_name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {ticket.customer_phone_number || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{ticket.customer_email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Ngày giờ">
              {ticket.create_at ? formatToVietnamTime(ticket.create_at) : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {displayPaymentMethod(ticket.method)}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Nhân viên">{userName || 'N/A'}</Descriptions.Item> */}
          </Descriptions>
        </Card>
        <Card
          title="Chi tiết hóa đơn"
          variant="borderless"
          className="shadow-sm border border-gray-200 "
        >
          <Table
            columns={columns}
            dataSource={ticket.data || []}
            rowKey={(record) => record.create_at || `row-${Math.random()}`}
            pagination={false}
            locale={{ emptyText: 'Không có dữ liệu dịch vụ' }}
            className="mb-4 overflow-x-auto h-[30rem]"
          />
          <div className="flex justify-between border-t pt-4">
            <Text strong>Tổng tiền:</Text>
            <Text strong>{ticket.total_price ? formatCurrency(ticket.total_price) : 'N/A'}</Text>
          </div>
          <div className="flex justify-between">
            <Text strong>Phụ thu:</Text>
            <Text strong>{formatCurrency(0)}</Text>
          </div>
          <div className="flex justify-between">
            <Text strong className="text-green-600">
              Thành tiền:
            </Text>
            <Text strong className="text-green-600">
              {ticket.total_price ? formatCurrency(ticket.total_price) : 'N/A'}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
