import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Table, 
  Button, 
  Divider, 
  Typography, 
  Tag, 
  Image, 
  Space, 
  Steps, 
  message 
} from 'antd';
import { 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined, 
  ShoppingCartOutlined 
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetOrderDetail } from '../OrderDetailPage/Hook/useGetOrderDetail';


// Interfaces từ user
export interface IGetOrderDetailResponse {
  orderId: string;
  orderCode: string;
  status: string;
  amount: number;
  id: string;
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  shipAddress: string;
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL' | null;
  items: IOrderItemDetail[];
  createBy: string;
  createAt: string;
  updateAt: string;
}

export interface IOrderItemDetail {
  orderItemId: string;
  productName: string;
  productPrice: number;
  productImage: string[];
  productCode: string;
  categoryName: string;
  productVolume: string;
  colorName: string;
  productUnit: string;
  productQuantity: number;
  quantity: number;
}

// Interface cho tỉnh/quận
interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  provinceCode: number;
}

const { Title, Text } = Typography;

const TransactionPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderData, isLoading, error } = useGetOrderDetail(orderId || '');

  // State cho địa chỉ (chọn tỉnh/quận)
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Form instance
  const [form] = Form.useForm();

  // Load provinces từ API
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => toast.error('Lỗi tải tỉnh/thành phố: ' + err.message));
  }, []);

  // Load districts dựa trên tỉnh
  useEffect(() => {
    if (selectedProvince) {
      const provinceCode = provinces.find(p => p.name === selectedProvince)?.code;
      if (provinceCode) {
        fetch(`https://provinces.open-api.vn/api/d?province_code=${provinceCode}`)
          .then(res => res.json())
          .then(data => setDistricts(data))
          .catch(err => toast.error('Lỗi tải quận/huyện: ' + err.message));
      }
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, provinces]);

  // Khởi tạo form với data từ order
  useEffect(() => {
    if (orderData) {
      form.setFieldsValue({
        userName: orderData.userName,
        email: orderData.email,
        phone: orderData.phone,
        shipAddress: orderData.shipAddress,
        paymentMethod: orderData.paymentMethod || 'CASH',
      });
      // Parse tỉnh/quận từ shipAddress nếu có (giả sử format "Quận X, Tỉnh Y")
      const addressParts = orderData.shipAddress.split(', ');
      setSelectedDistrict(addressParts[0] || '');
      setSelectedProvince(addressParts[1] || '');
    }
  }, [orderData, form]);

  // Columns cho Table items
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (product: IOrderItemDetail) => (
        <Space>
          <Image
            src={product.productImage[0]}
            width={60}
            height={60}
            alt={product.productName}
            style={{ borderRadius: '4px' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          <div>
            <Text strong>{product.productName}</Text>
            <br />
            <Tag size="small" color="blue">{product.categoryName}</Tag>
            <Tag size="small">{product.productCode}</Tag>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {product.productVolume} - {product.colorName} - {product.productUnit}
            </Text>
          </div>
        </Space>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'price',
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
      responsive: ['sm'],
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      responsive: ['sm'],
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: IOrderItemDetail) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.productPrice * record.quantity),
    },
  ];

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    form.setFieldsValue({ shipAddress: '' }); // Reset địa chỉ khi thay đổi tỉnh
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    // Tự động cập nhật shipAddress
    if (selectedProvince && value) {
      form.setFieldsValue({ shipAddress: `${value}, ${selectedProvince}` });
    }
  };

  const handleConfirm = () => {
    form
      .validateFields()
      .then(values => {
        // Giả định gọi API update order với values (paymentMethod, shipAddress)
        toast.success('Xác nhận đơn hàng thành công! Đang chuyển hướng...');
        // Ví dụ: navigate('/order-success');
      })
      .catch(info => {
        toast.error('Vui lòng kiểm tra thông tin!');
      });
  };

  if (error) {
    return <div className="p-8 text-center text-red-600">Không thể tải thông tin đơn hàng.</div>;
  }

  if (isLoading) {
    return <div className="p-8 text-center"><div>Loading...</div></div>; // Có thể dùng Skeleton
  }

  if (!orderData) {
    return <div className="p-8 text-center">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Steps Progress */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={24}>
            <Steps
              current={1} // Giả sử bước 2: Xác nhận thanh toán
              items={[
                { title: 'Giỏ hàng' },
                { title: 'Thanh toán' },
                { title: 'Hoàn thành' },
              ]}
              responsive={true}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Left Column: Items & Summary */}
          <Col xs={24} lg={16}>
            {/* Order Info Card */}
            <Card className="mb-4">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={3} className="text-center mb-0">Đơn hàng #{orderData.orderCode}</Title>
                <Space className="justify-center">
                  <Tag color={orderData.status === 'PENDING' ? 'blue' : 'green'}>
                    {orderData.status === 'PENDING' ? 'Chờ xác nhận' : 'Đã xác nhận'}
                  </Tag>
                  <Text type="secondary">
                    Tạo lúc: {new Date(orderData.createAt).toLocaleDateString('vi-VN')}
                  </Text>
                </Space>
              </Space>
            </Card>

            {/* Items Table */}
            <Card title="Sản phẩm trong đơn hàng" className="mb-4">
              <Table
                dataSource={orderData.items}
                columns={columns}
                pagination={false}
                rowKey="orderItemId"
                loading={isLoading}
                scroll={{ x: 768 }} // Responsive cho mobile
              />
              <Divider />
              <div className="text-right">
                <Text strong>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderData.amount)}</Text>
              </div>
            </Card>
          </Col>

          {/* Right Column: Form Thanh toán */}
          <Col xs={24} lg={8}>
            <Card title="Thông tin thanh toán">
              <Form
                form={form}
                layout="vertical"
                initialValues={{ paymentMethod: 'CASH' }}
              >
                {/* Thông tin người dùng */}
                <Card size="small" title="Thông tin khách hàng" className="mb-4">
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Space><UserOutlined /><Text>{orderData.userName}</Text></Space>
                    <Space><MailOutlined /><Text>{orderData.email}</Text></Space>
                    <Space><PhoneOutlined /><Text>{orderData.phone}</Text></Space>
                  </Space>
                </Card>

                {/* Địa chỉ giao hàng */}
                <Card size="small" title="Địa chỉ giao hàng" className="mb-4">
                  <Form.Item
                    name="shipAddress"
                    label="Địa chỉ chi tiết"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input placeholder="Số nhà, đường..." prefix={<HomeOutlined />} />
                  </Form.Item>
                  <Form.Item label="Tỉnh/Thành phố" required>
                    <Select
                      placeholder="Chọn tỉnh/thành phố"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      options={provinces.map(p => ({ value: p.name, label: p.name }))}
                      loading={!provinces.length}
                    />
                  </Form.Item>
                  <Form.Item label="Quận/Huyện" required>
                    <Select
                      placeholder="Chọn quận/huyện"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      options={districts.map(d => ({ value: d.name, label: d.name }))}
                      disabled={!selectedProvince}
                    />
                  </Form.Item>
                </Card>

                {/* Phương thức thanh toán */}
                <Card size="small" title="Phương thức thanh toán">
                  <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}>
                    <Radio.Group>
                      <Radio value="CASH">
                        <Space><EnvironmentOutlined /> Tiền mặt (COD)</Space>
                      </Radio>
                      <Radio value="VN_PAY">
                        <Space> VN Pay (Chuyển khoản)</Space>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                <Divider />

                <Button type="primary" size="large" block onClick={handleConfirm} className="mt-4">
                  Xác nhận thanh toán
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CSS cho responsive và màu sắc đơn giản */}
      <style jsx>{`
        .ant-card { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .ant-table { background: #fff; }
        @media (max-width: 768px) {
          .ant-steps { margin: 0 -16px; padding: 0 16px; }
          .ant-table { font-size: 12px; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .ant-table { font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

export default TransactionPage;