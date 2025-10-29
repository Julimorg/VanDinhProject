import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Table,
  Button,
  Space,
  Grid,
  Tag,
  Divider,
  Statistic,
  Badge,
} from 'antd';
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useGetOrderDetail } from './Hook/useGetOrderDetail';
import type { ColumnsType } from 'antd/es/table';
import { IOrderItemDetail } from '@/Interface/Order/IGetOrderDetail';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const { data, isLoading, error } = useGetOrderDetail(orderId);

  const order = data?.data;

  // Hàm render trạng thái đơn hàng với màu sắc
  const renderOrderStatus = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      Pending: { color: 'orange', icon: <ClockCircleOutlined />, },
      Approve: { color: 'blue', icon: <ClockCircleOutlined /> },
      Cancelled: { color: 'red', icon: <ClockCircleOutlined /> },
    };

    const config = statusConfig[status] || { color: 'default', icon: <ClockCircleOutlined /> };

    return (
      <Tag color={config.color} icon={config.icon} style={{ fontSize: '14px', padding: '4px 12px' }}>
        {status}
      </Tag>
    );
  };

  // Hàm render phương thức thanh toán
  const renderPaymentMethod = (method: string | null) => {
    if (!method) return <Text type="secondary">-</Text>;

    const methodConfig: Record<string, { label: string; icon: string }> = {
      CASH: { label: 'Tiền mặt (COD)', icon: '💵' },
      VN_PAY: { label: 'VNPAY', icon: '🏦' },
      PAY_PAL: { label: 'PAYPAL', icon: '💳' },
    };

    const config = methodConfig[method] || { label: method, icon: '💰' };

    return (
      <Space>
        <span>{config.icon}</span>
        <Text strong>{config.label}</Text>
      </Space>
    );
  };

  const columns: ColumnsType<IOrderItemDetail> = [
    {
      title: 'ID sản phẩm',
      dataIndex: 'orderItemId',
      key: 'orderItemId',
      width: 150,
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center',
      render: (text) => (
        <Badge
          count={text}
          showZero
          style={{ backgroundColor: '#1677ff' }}
        />
      ),
    },
  ];

  if (error) {
    console.error(error);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: screens.xs ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header với gradient */}
        <Card
          bordered={false}
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              size="large"
              style={{ padding: '4px 8px' }}
            >
              Quay lại
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <ShoppingOutlined style={{ fontSize: '48px', color: '#1677ff' }} />
                <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
                  Chi tiết đơn hàng
                </Title>
                {order && (
                  //break line/block
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '24px' }}>
                      Tạo bởi: <Text strong style={{fontSize: '24px'}}>{order.createBy}</Text>
                    </Text>
                    <Text type="secondary" style={{ fontSize: '24px' }}>
                      Mã đơn: <Text strong style={{fontSize: '24px'}}>{order.orderCode}</Text>
                    </Text>
                    
                  </div>

                )}
              </Space>
            </div>
          </Space>
        </Card>

        <Spin spinning={isLoading} size="large">
          {order && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Thống kê nhanh */}
              <Card
                bordered={false}
                style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Statistic
                      title={<Text strong>Tổng tiền đơn hàng</Text>}
                      value={order.orderAmount}
                      precision={0}
                      suffix="₫"
                      prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                      valueStyle={{ color: '#52c41a', fontSize: screens.xs ? '24px' : '32px' }}
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: screens.xs ? 'left' : 'center' }}>
                      <Text type="secondary" strong>Trạng thái đơn hàng</Text>
                      <div style={{ marginTop: '8px' }}>
                        {renderOrderStatus(order.status)}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: screens.xs ? 'left' : 'right' }}>
                      <Text type="secondary" strong>Phương thức thanh toán</Text>
                      <div style={{ marginTop: '8px' }}>
                        {renderPaymentMethod(order.paymentMethod)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Thông tin chi tiết */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      height: '100%',
                    }}
                    title={
                      <Space>
                        <ShoppingOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
                        <Text strong style={{ fontSize: '18px' }}>Thông tin đơn hàng</Text>
                      </Space>
                    }
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text type="secondary">
                          <ShoppingOutlined /> ID đơn hàng:
                        </Text>
                        <br />
                        <Text strong code style={{ fontSize: '14px' }}>{order.orderId}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <ShoppingOutlined /> Mã đơn:
                        </Text>
                        <br />
                        <Text strong>{order.orderCode}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <CheckCircleOutlined /> Trạng thái:
                        </Text>
                        <br />
                        {renderOrderStatus(order.status)}
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <DollarOutlined /> Tổng tiền:
                        </Text>
                        <br />
                        <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                          {order.orderAmount.toLocaleString('vi-VN')} ₫
                        </Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <EnvironmentOutlined /> Địa chỉ giao hàng:
                        </Text>
                        <br />
                        <Text>{order.shipAddress}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <CreditCardOutlined /> Phương thức thanh toán:
                        </Text>
                        <br />
                        {renderPaymentMethod(order.paymentMethod)}
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <CalendarOutlined /> Ngày tạo:
                        </Text>
                        <br />
                        <Text>{new Date(order.createAt).toLocaleString('vi-VN')}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <CalendarOutlined /> Ngày cập nhật:
                        </Text>
                        <br />
                        <Text>{new Date(order.updateAt).toLocaleString('vi-VN')}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      height: '100%',
                    }}
                    title={
                      <Space>
                        <UserOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                        <Text strong style={{ fontSize: '18px' }}>Thông tin khách hàng</Text>
                      </Space>
                    }
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text type="secondary">
                          <UserOutlined /> ID khách hàng:
                        </Text>
                        <br />
                        <Text strong code style={{ fontSize: '14px' }}>{order.id}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <UserOutlined /> Tên khách hàng:
                        </Text>
                        <br />
                        <Text strong style={{ fontSize: '16px' }}>{order.userName}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <MailOutlined /> Email:
                        </Text>
                        <br />
                        <Text copyable>{order.email}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <PhoneOutlined /> Số điện thoại:
                        </Text>
                        <br />
                        <Text copyable strong>{order.phone}</Text>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div>
                        <Text type="secondary">
                          <HomeOutlined /> Địa chỉ nhà khách hàng:
                        </Text>
                        <br />
                        <Text>{order.userAddress}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>

              {/* Danh sách sản phẩm */}
              <Card
                bordered={false}
                style={{
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
                title={
                  <Space>
                    <ShoppingOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                    <Text strong style={{ fontSize: '18px' }}>Danh sách sản phẩm</Text>
                    <Badge count={order.orderItems.length} showZero style={{ backgroundColor: '#1677ff' }} />
                  </Space>
                }
              >
                <Table
                  columns={columns}
                  dataSource={order.orderItems}
                  rowKey="orderItemId"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  style={{ borderRadius: '8px', overflow: 'hidden' }}
                  rowClassName={(_, index) => index % 2 === 0 ? 'bg-gray-50' : ''}
                />
              </Card>
            </Space>
          )}

          {!order && !isLoading && (
            <Card
              bordered={false}
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                padding: '60px 20px',
              }}
            >
              <Space direction="vertical" size="large">
                <ShoppingOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />
                <Text type="danger" style={{ fontSize: '18px' }}>
                  Không tìm thấy đơn hàng hoặc đã xảy ra lỗi.
                </Text>
                <Button type="primary" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </Space>
            </Card>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default OrderDetailPage;