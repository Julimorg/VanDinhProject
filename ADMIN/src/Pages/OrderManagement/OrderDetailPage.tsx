import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Spin,
  Table,
  Button,
  Space,
  Tag,
  Divider,
  Statistic,
  Badge,
  Row,
  Col,
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
  PrinterOutlined,
} from '@ant-design/icons';
import { useGetOrderDetail } from './Hook/useGetOrderDetail';
import type { ColumnsType } from 'antd/es/table';
import { IOrderItemDetail } from '@/Interface/Order/IGetOrderDetail';
import { formatToVietnamTime } from '@/Utils/ulti';
import { usePrint } from '@/Hook/usePrint';

const { Title, Text } = Typography;

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { handlePrint } = usePrint(printRef);

  const { data, isLoading, error } = useGetOrderDetail(orderId);
  const order = data?.data;

  console.log("Data: " , data);

  const renderOrderStatus = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; printText: string }> = {
      Pending: { color: 'orange', icon: <ClockCircleOutlined />, printText: 'Chờ xử lý' },
      Approve: { color: 'blue', icon: <CheckCircleOutlined />, printText: 'Đã duyệt' },
      Cancelled: { color: 'red', icon: <ClockCircleOutlined />, printText: 'Đã hủy' },
    };

    const config = statusConfig[status] || { color: 'default', icon: <ClockCircleOutlined />, printText: status };

    return (
      <>
        <span className="print:hidden">
          <Tag color={config.color} icon={config.icon} style={{ fontSize: '14px', padding: '4px 12px' }}>
            {status}
          </Tag>
        </span>
        <span className="hidden print:inline text-black font-medium">{config.printText}</span>
      </>
    );
  };

  // Hàm render phương thức thanh toán (đơn giản hóa cho print)
  const renderPaymentMethod = (method: string | null) => {
    if (!method) return <Text type="secondary" className="print:hidden">-</Text>;

    const methodConfig: Record<string, { label: string; icon: string; printLabel: string }> = {
      CASH: { label: 'Tiền mặt (COD)', icon: '💵', printLabel: 'Tiền mặt (COD)' },
      VN_PAY: { label: 'VNPAY', icon: '🏦', printLabel: 'VNPAY' },
      PAY_PAL: { label: 'PAYPAL', icon: '💳', printLabel: 'PAYPAL' },
    };

    const config = methodConfig[method] || { label: method, icon: '💰', printLabel: method };

    return (
      <>
        <span className="print:hidden">
          <Space>
            <span>{config.icon}</span>
            <Text strong>{config.label}</Text>
          </Space>
        </span>
        <span className="hidden print:inline text-black font-medium">{config.printLabel}</span>
      </>
    );
  };

  // Cột cho bảng sản phẩm (sử dụng AntD Table cho screen, nhưng override cho print)
  const columns: ColumnsType<IOrderItemDetail> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (_, __, index) => <Text>{index + 1}</Text>,
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
      width: 100,
      align: 'center',
      render: (text) => (
        <>
          <span className="print:hidden">
            <Badge
              count={text}
              showZero
              style={{ backgroundColor: '#1677ff' }}
            />
          </span>
          <span className="hidden print:inline">{text}</span>
        </>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 120,
      align: 'right',
      render: () => <Text> - </Text>,
    },
  ];

  if (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Ẩn khi in */}
        <div className="print:hidden mb-6">
          <Space direction="vertical" size="middle" className="w-full">
            <Space className="w-full justify-between items-center">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                size="large"
              >
                Quay lại
              </Button>
              {order && (
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  size="large"
                >
                  In hóa đơn
                </Button>
              )}
            </Space>

            <div className="text-center">
              <Space direction="vertical" size="small">
                <ShoppingOutlined className="text-5xl text-blue-500" />
                <Title level={2} className="m-0 text-blue-500">
                  Hóa đơn chi tiết
                </Title>
                {order && (
                  <div className="flex flex-col gap-1">
                    <Text className="text-lg text-gray-600">
                      Tạo bởi: <Text strong className="text-lg">{order.createBy}</Text>
                    </Text>
                    <Text className="text-lg text-gray-600">
                      Mã đơn: <Text strong className="text-lg">{order.orderCode}</Text>
                    </Text>
                  </div>
                )}
              </Space>
            </div>
          </Space>
        </div>

        <Spin spinning={isLoading} size="large">
          {order ? (
            <div ref={printRef} id="printable" className="print:block print:w-full print:max-w-none">
              {/* Phần hiển thị màn hình (ẩn khi in) */}
              <div className="print:hidden">
                <Card className="border-0 shadow-lg">
                  <Row gutter={[16, 16]} className="my-6">
                    <Col xs={24} md={12}>
                      <Space direction="vertical" className="w-full">
                        <div>
                          <Text className="text-gray-600 block">
                            <ShoppingOutlined className="mr-2" /> Mã đơn hàng:
                          </Text>
                          <Text strong className="text-lg">{order.orderCode}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <CheckCircleOutlined className="mr-2" /> Trạng thái:
                          </Text>
                          <div>{renderOrderStatus(order.status)}</div>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <CalendarOutlined className="mr-2" /> Ngày tạo:
                          </Text>
                          <Text>{formatToVietnamTime(order.createAt)}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <CalendarOutlined className="mr-2" /> Ngày cập nhật:
                          </Text>
                          <Text>{formatToVietnamTime(order.updateAt)}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <EnvironmentOutlined className="mr-2" /> Địa chỉ giao hàng:
                          </Text>
                          <Text>{order.shipAddress}</Text>
                        </div>
                      </Space>
                    </Col>
                    <Col xs={24} md={12}>
                      <Space direction="vertical" className="w-full">
                        <div>
                          <Text className="text-gray-600 block">
                            <UserOutlined className="mr-2" /> Tên khách hàng:
                          </Text>
                          <Text strong className="text-lg">{order.userName}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <MailOutlined className="mr-2" /> Email:
                          </Text>
                          <Text>{order.email}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <PhoneOutlined className="mr-2" /> Số điện thoại:
                          </Text>
                          <Text strong>{order.phone}</Text>
                        </div>
                        <Divider className="my-2" />
                        <div>
                          <Text className="text-gray-600 block">
                            <HomeOutlined className="mr-2" /> Địa chỉ khách hàng:
                          </Text>
                          <Text>{order.userAddress}</Text>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <Divider>
                    <Text strong className="text-lg">DANH SÁCH SẢN PHẨM</Text>
                  </Divider>
                  <Table
                    columns={columns}
                    dataSource={order.orderItems}
                    rowKey="orderItemId"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    size="small"
                  />
                  <Row gutter={[16, 16]} className="my-6">
                    <Col xs={24} sm={8}>
                      <div className="text-right">
                        <Text className="text-gray-600 block">
                          <CreditCardOutlined className="mr-2" /> Phương thức thanh toán:
                        </Text>
                        <div>{renderPaymentMethod(order.paymentMethod)}</div>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div className="text-right">
                        <Text className="text-gray-600 block">Số lượng sản phẩm:</Text>
                        <Text strong className="text-lg">{order.orderItems.length}</Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title={<Text strong>Tổng tiền</Text>}
                        value={order.orderAmount}
                        precision={0}
                        suffix="₫"
                        prefix={<DollarOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </div>

              {/* Phần in ấn (ẩn trên màn hình, hiện khi in) */}
              <div className="hidden print:block max-w-[600px] mx-auto" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: 1.3 }}>
                {/* Header */}
                <table className="w-full border-collapse border border-black">
                  <tbody>
                    <tr>
                      <td colSpan={4} className="text-center border border-black py-2" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        HÓA ĐƠN BÁN HÀNG
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-center border border-black py-1" style={{ fontSize: '11px' }}>
                        Công ty TNHH ABC Shop - Địa chỉ: 123 Đường ABC, TP.HCM | ĐT: 0123456789 | Email: info@abcshop.vn
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Thông tin đơn */}
                <table className="w-full border-collapse border border-black my-1">
                  <tbody>
                    <tr>
                      <td className="border border-black py-1 px-1 text-right w-1/4" style={{ fontSize: '11px' }}>Đơn:</td>
                      <td className="border border-black py-1 px-1 w-1/4" style={{ fontSize: '11px', fontWeight: 'bold' }}>{order.orderCode}</td>
                      <td className="border border-black py-1 px-1 text-right w-1/4" style={{ fontSize: '11px' }}>Ngày:</td>
                      <td className="border border-black py-1 px-1 w-1/4" style={{ fontSize: '11px' }}>{formatToVietnamTime(order.createAt)}</td>
                    </tr>
                    <tr>
                      <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}>Trạng thái:</td>
                      <td className="border border-black py-1 px-1" style={{ fontSize: '11px' }}>{renderOrderStatus(order.status)}</td>
                      <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}>Khách:</td>
                      <td className="border border-black py-1 px-1" style={{ fontSize: '11px' }}>{order.userName}</td>
                    </tr>
                    <tr>
                      <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}>SĐT/Email:</td>
                      <td colSpan={3} className="border border-black py-1 px-1" style={{ fontSize: '11px' }}>{order.phone} / {order.email}</td>
                    </tr>
                    <tr>
                      <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}>Địa chỉ:</td>
                      <td colSpan={3} className="border border-black py-1 px-1" style={{ fontSize: '10px' }}>{order.userAddress} | Giao: {order.shipAddress}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Bảng sản phẩm */}
                <table className="w-full border-collapse border border-black my-1">
                  <thead>
                    <tr>
                      <th className="border border-black py-1 px-1 text-center" style={{ fontSize: '10px' }}>STT</th>
                      <th className="border border-black py-1 px-1 text-left" style={{ fontSize: '10px' }}>Tên hàng</th>
                      <th className="border border-black py-1 px-1 text-center" style={{ fontSize: '10px' }}>Đơn vị</th>
                      <th className="border border-black py-1 px-1 text-center" style={{ fontSize: '10px' }}>SL</th>
                      <th className="border border-black py-1 px-1 text-right" style={{ fontSize: '10px' }}>Đơn giá</th>
                      <th className="border border-black py-1 px-1 text-right" style={{ fontSize: '10px' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={item.orderItemId}>
                        <td className="border border-black py-1 px-1 text-center" style={{ fontSize: '11px' }}>{index + 1}</td>
                        <td className="border border-black py-1 px-1" style={{ fontSize: '11px' }}>{item.productName}</td>
                        <td className="border border-black py-1 px-1 text-center" style={{ fontSize: '11px' }}>Cái</td>
                        <td className="border border-black py-1 px-1 text-center" style={{ fontSize: '11px' }}>{item.quantity}</td>
                        <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}> - </td>
                        <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px' }}> - </td>
                      </tr>
                    ))}
                    {order.orderItems.length < 10 && Array.from({ length: Math.min(10 - order.orderItems.length, 5) }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                        <td className="border border-black py-1 px-1">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Tóm tắt */}
                <table className="w-full border-collapse border border-black my-1">
                  <tbody>
                    <tr>
                      <td className="border border-black py-1 px-1 w-1/2" style={{ fontSize: '11px' }}>
                        Cộng tiền hàng (Bằng chữ): {order.orderAmount.toLocaleString()} đồng
                      </td>
                      <td className="border border-black py-1 px-1 text-right" style={{ fontSize: '11px', fontWeight: 'bold' }}>
                        Tổng: {order.orderAmount.toLocaleString()} ₫
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="border border-black py-1 px-1 text-center" style={{ fontSize: '11px' }}>
                        Phương thức: {renderPaymentMethod(order.paymentMethod)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer chữ ký */}
                <table className="w-full border-collapse border-2 border-black">
                  <tbody>
                    <tr>
                      <td className="border border-black py-2 px-1 text-center" style={{ fontSize: '11px' }}>Người nhận hàng</td>
                      <td className="border border-black py-2 px-1 text-center" style={{ fontSize: '11px' }}>Người giao hàng</td>
                      <td className="border border-black py-2 px-1 text-center" style={{ fontSize: '11px' }}>Ngày: {formatToVietnamTime(new Date().toISOString())}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            !isLoading && (
              <Card
                className="text-center p-8 border-0 shadow-lg print:shadow-none"
                style={{ borderRadius: '12px', background: 'white' }}
              >
                <Space direction="vertical" size="large">
                  <ShoppingOutlined className="text-6xl text-red-500" />
                  <Text type="danger" className="text-xl">
                    Không tìm thấy đơn hàng hoặc đã xảy ra lỗi.
                  </Text>
                  <Button type="primary" onClick={() => navigate(-1)}>
                    Quay lại
                  </Button>
                </Space>
              </Card>
            )
          )}
        </Spin>
      </div>

   
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable, #printable * { visibility: visible; }
          #printable { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            max-width: 600px;
            margin: 0 auto;
            font-size: 12px;
            line-height: 1.3;
          }
          table { border-collapse: collapse; }
          th, td { border: 1px solid black !important; }
          @page { 
            size: A4 portrait; 
            margin: 1cm; 
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;