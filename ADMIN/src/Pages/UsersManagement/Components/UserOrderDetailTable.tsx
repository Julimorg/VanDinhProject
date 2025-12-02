
import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Empty,
  Result,
  List,
  Avatar,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { IUserOrderResponse } from '@/Interface/Order/IUserOrder';
import { useGetMyListOrder } from '../Hook/useGetOrderHistory';


const { Text, Title } = Typography;
const { Option } = Select;

interface UserOrderHistoryProps {
  userId: string;
}

const UserOrderHistory: React.FC<UserOrderHistoryProps> = ({ userId }) => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  const { data: response, isLoading, error, refetch, isFetching } = useGetMyListOrder(
    userId,
    { keyword, status, page, size, sort: 'createAt,desc' },
  );

  const orders: IUserOrderResponse[] = Array.isArray(response?.data?.content)
    ? response.data.content
    : [];
  const pagination = response?.data?.page;

  const handleViewDetail = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const desktopColumns: ColumnsType<IUserOrderResponse> = [
    {
      title: 'Mã ĐH',
      dataIndex: 'orderCode',
      key: 'orderCode',
      fixed: 'left',
      width: 140,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shipAddress',
      key: 'shipAddress',
      width: 280,
      ellipsis: true,
      responsive: ['lg'],
    },
    {
      title: 'SL',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      width: 80,
      align: 'center',
      responsive: ['md'],
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      width: 160,
      render: (value: number) => (
        <Text strong type="danger">
          {value.toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (status: string) => {
        const map = {
          Approved: { color: 'green', label: 'Đã duyệt' },
          Canceled: { color: 'red', label: 'Đã hủy' },
          Pending: { color: 'orange', label: 'Chờ duyệt' },
        } as const;
        const item = map[status as keyof typeof map] || { color: 'default', label: status };
        return <Tag color={item.color}>{item.label}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
      responsive: ['xl'],
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.orderId)}>
          Xem
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <Result
          status="error"
          title="Không tải được đơn hàng"
          subTitle="Vui lòng kiểm tra mạng và thử lại."
          extra={
            <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title={<Title level={4} className="m-0">Lịch Sử Đơn Hàng</Title>}
      extra={
        <Space direction="vertical" size="small" className="w-full sm:w-auto">
          <Input
            placeholder="Tìm đơn hàng..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            allowClear
            className="w-full"
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            value={status}
            onChange={(v) => {
              setStatus(v || undefined);
              setPage(0);
            }}
            className="w-full"
            style={{ minWidth: 140 }}
          >
            <Option value="Pending">Chờ duyệt</Option>
            <Option value="Approved">Đã duyệt</Option>
            <Option value="Canceled">Đã hủy</Option>
          </Select>
        </Space>
      }
      className="shadow-lg"
    >
      {/* Desktop: Table View */}
      <div className="hidden lg:block">
        <Table<IUserOrderResponse>
          columns={desktopColumns}
          dataSource={orders}
          loading={isLoading || isFetching}
          rowKey="orderId"
          pagination={{
            current: page + 1,
            pageSize: size,
            total: pagination?.totalElements ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (p, s) => {
              setPage(p - 1);
              if (s) setSize(s);
            },
          }}
          scroll={{ x: 1000 }}
          size="large"
          bordered
        />
      </div>

      {/* Mobile & Tablet: Card List View */}
      <div className="block lg:hidden">
        <List
          loading={isLoading || isFetching}
          dataSource={orders}
          locale={{ emptyText: <Empty description="Không có đơn hàng" /> }}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: pagination?.totalElements ?? 0,
            onChange: (p, s) => {
              setPage(p - 1);
              if (s) setSize(s);
            },
            pageSizeOptions: ['10', '20'],
            showSizeChanger: true,
          }}
          renderItem={(item) => (
            <List.Item
              key={item.orderId}
              actions={[
                <Button
                  type="primary"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetail(item.orderId)}
                >
                  Xem
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#f56a00' }}>{item.total_quantity}</Avatar>}
                title={
                  <Space direction="vertical" size={0}>
                    <Text strong>{item.orderCode}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <EnvironmentOutlined /> {item.shipAddress.substring(0, 40)}...
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Space>
                      <MoneyCollectOutlined />
                      <Text strong type="danger">
                        {item.orderAmount.toLocaleString('vi-VN')} ₫
                      </Text>
                    </Space>
                    <Space>
                      <CalendarOutlined />
                      <Text type="secondary">
                        {new Date(item.createAt).toLocaleDateString('vi-VN')}
                      </Text>
                    </Space>
                    <Tag
                      color={
                        item.orderStatus === 'Approved'
                          ? 'green'
                          : item.orderStatus === 'Canceled'
                          ? 'red'
                          : 'orange'
                      }
                    >
                      {item.orderStatus === 'Approved'
                        ? 'Đã duyệt'
                        : item.orderStatus === 'Canceled'
                        ? 'Đã hủy'
                        : 'Chờ duyệt'}
                    </Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default UserOrderHistory;