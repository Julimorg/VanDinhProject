import React from 'react';
import { Card, Statistic, Table, Tag, Button, Typography, Space, Row, Col } from 'antd';
import { RiseOutlined, DollarOutlined, ShoppingCartOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Order {
  key: string;
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
}

const DashboardPage: React.FC = () => {
  const stats = [
    { 
      title: 'Tổng Doanh Thu', 
      value: 125500000, 
      prefix: '₫', 
      suffix: '',
      trend: '+12.5%',
      icon: <DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    { 
      title: 'Đơn Hàng Mới', 
      value: 48, 
      suffix: '',
      trend: '+8.2%',
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />
    },
    { 
      title: 'Sản Phẩm', 
      value: 256, 
      suffix: '',
      trend: '+3.1%',
      icon: <AppstoreOutlined style={{ fontSize: 24, color: '#722ed1' }} />
    },
    { 
      title: 'Khách Hàng', 
      value: 1234, 
      suffix: '',
      trend: '+15.3%',
      icon: <TeamOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
    },
  ];

  // const columns: ColumnsType<Order> = [
  //   {
  //     title: 'Mã ĐH',
  //     dataIndex: 'id',
  //     key: 'id',
  //     width: 120,
  //     fixed: 'left',
  //     render: (text) => <Text strong>{text}</Text>,
  //   },
  //   {
  //     title: 'Khách Hàng',
  //     dataIndex: 'customer',
  //     key: 'customer',
  //     width: 150,
  //   },
  //   {
  //     title: 'Sản Phẩm',
  //     dataIndex: 'product',
  //     key: 'product',
  //     width: 200,
  //   },
  //   {
  //     title: 'Số Tiền',
  //     dataIndex: 'amount',
  //     key: 'amount',
  //     width: 150,
  //     render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
  //   },
  //   {
  //     title: 'Trạng Thái',
  //     dataIndex: 'status',
  //     key: 'status',
  //     width: 150,
  //     render: (status) => {
  //       let color = 'default';
  //       if (status === 'Đã giao') color = 'success';
  //       if (status === 'Đang xử lý') color = 'processing';
  //       if (status === 'Đang giao') color = 'warning';
  //       if (status === 'Chờ xác nhận') color = 'default';
  //       return <Tag color={color}>{status}</Tag>;
  //     },
  //   },
  // ];

  const dataSource: Order[] = [
    { 
      key: '1',
      id: '#ORD-001', 
      customer: 'Nguyễn Văn A', 
      product: 'Sơn Dulux 5L', 
      amount: '1,250,000 ₫', 
      status: 'Đang xử lý' 
    },
    { 
      key: '2',
      id: '#ORD-002', 
      customer: 'Trần Thị B', 
      product: 'Sơn Nippon 18L', 
      amount: '3,500,000 ₫', 
      status: 'Đã giao' 
    },
    { 
      key: '3',
      id: '#ORD-003', 
      customer: 'Lê Văn C', 
      product: 'Sơn Jotun 3.5L', 
      amount: '850,000 ₫', 
      status: 'Chờ xác nhận' 
    },
    { 
      key: '4',
      id: '#ORD-004', 
      customer: 'Phạm Thị D', 
      product: 'Combo Sơn + Lăn', 
      amount: '2,100,000 ₫', 
      status: 'Đang giao' 
    },
  ];

  return (
    <>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              bordered={false}
              hoverable
              className="h-full"
            >
              <Space direction="vertical" className="w-full" size="small">
                <Space className="justify-between w-full">
                  {stat.icon}
                  <Tag color="success" icon={<RiseOutlined />}>{stat.trend}</Tag>
                </Space>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  valueStyle={{ color: '#262626', fontSize: 24, fontWeight: 600 }}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Orders Table */}
      <Card 
        title={<Text strong className="text-lg">Đơn Hàng Gần Đây</Text>}
        extra={<Button type="link">Xem tất cả</Button>}
        bordered={false}
      >
        <Table 
          // columns={columns} 
          dataSource={dataSource} 
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </>
  );
};

export default DashboardPage;