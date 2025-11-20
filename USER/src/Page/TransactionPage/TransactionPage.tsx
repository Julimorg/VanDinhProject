
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Steps,
  Tag,
  Avatar,
  Space,
  Typography,
  Spin,
  Result,
  Divider,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useGetOrderDetail } from '../OrderDetailPage/Hook/useGetOrderDetail';
import ShippingAddressForm from './Components/ShippAddressForm';
import PaymentMethodCard from './Components/PaymentMethod';
import TransactionItemCard from './Components/TransactionItemCard';
import { formatCurrency } from '../../Utils/utils';
import ConfirmPaymentButton from './Components/ConfirmPaymentButton';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';

const { Title, Text } = Typography;

const TransactionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { orderId } = useParams<{ orderId: string }>();
  const userId = useAuthStoreCookiesStorage(state => state.id);


  const { data: orderResponse, isLoading, isError } = useGetOrderDetail(orderId || '');
  const order = orderResponse?.data;

  const paymentMethod = Form.useWatch('paymentMethod', form) || 'CASH';
  const shipAddress = Form.useWatch('address', form) || order?.shipAddress || order?.userAddress || '';



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }


  if (isError || !order) {
    return (
      <Result
        status="404"
        title="Không tìm thấy đơn hàng"
        subTitle="Mã đơn hàng không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <Steps
            current={1}
            responsive
            items={[
              { title: 'Giỏ hàng', icon: <ShoppingCartOutlined /> },
              { title: 'Thanh toán & Địa chỉ', icon: <CreditCardOutlined /> },
              { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
            ]}
            className="site-steps"
          />
        </div>

        <Row gutter={[32, 32]}>
          {/* Cột trái: Thông tin đơn hàng + Sản phẩm */}
          <Col xs={24} lg={16}>
            {/* Header đơn hàng */}
            <Card className="mb-6 border-0 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Title level={2} className="mb-1 text-gray-800">
                    Đơn hàng{' '}
                    <span className="text-indigo-600 font-bold">#{order.orderCode}</span>
                  </Title>
                  <Space size="middle">
                    <Tag color="processing" icon={<CheckCircleOutlined />}>
                      Chờ thanh toán
                    </Tag>
                    <Text type="secondary">
                      Ngày tạo: {new Date(order.createAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </Space>
                </div>
                <Avatar size={64} icon={<ShoppingCartOutlined />} className="bg-indigo-600" />
              </div>
            </Card>

      
            <TransactionItemCard
              items={order.items}
              totalAmount={order.amount}
              formatCurrency={formatCurrency}
            />
          </Col>

          {/* Cột phải: Form xác nhận thanh toán */}
          <Col xs={24} lg={8}>
            <Card
              title={<Title level={3} className="text-center mb-0 text-gray-800">Xác nhận thanh toán</Title>}
              className="shadow-xl border-0 sticky top-6"
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  fullName: order.userName,
                  email: order.email,
                  phone: order.phone,
                  address: order.shipAddress || order.userAddress,
                  paymentMethod: order.paymentMethod || 'CASH',
                }}
              >
                {/* Thông tin khách hàng nhanh */}
                <Card size="small" className="mb-6 bg-gray-50 border-0">
                  <Space direction="vertical" size="middle" className="w-full text-gray-700">
                    <Space><UserOutlined className="text-indigo-600" /><Text strong>{order.userName}</Text></Space>
                    <Space><MailOutlined className="text-indigo-600" /><Text>{order.email}</Text></Space>
                    <Space><PhoneOutlined className="text-indigo-600" /><Text>{order.phone}</Text></Space>
                    <Space><HomeOutlined className="text-indigo-600" /><Text>{order.shipAddress || order.userAddress}</Text></Space>
                  </Space>
                </Card>

                {/* Form địa chỉ giao hàng */}
                <ShippingAddressForm form={form} />

                {/* Phương thức thanh toán */}
                <PaymentMethodCard />

                <Divider className="my-6" />

                {/* Nút hoàn tất */}
                <ConfirmPaymentButton
                  userId={userId ?? ''}
                  orderId={orderId!}
                  paymentMethod={paymentMethod}
                  shipAddress={shipAddress}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                />

                <Text type="secondary" className="block text-center mt-4 text-xs">
                  Bằng việc nhấn nút trên, bạn đồng ý với{' '}
                  <a href="/terms" className="text-indigo-600 underline hover:text-indigo-800">
                    điều khoản mua hàng
                  </a>{' '}
                  của chúng tôi.
                </Text>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      <style>{`
        /* Steps màu chuyên nghiệp */
        :global(.site-steps .ant-steps-item-process .ant-steps-item-icon) {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
        }
        :global(.site-steps .ant-steps-item-finish .ant-steps-item-icon) {
          background-color: #10b981 !important;
          border-color: #10b981 !important;
        }
        :global(.site-steps .ant-steps-item-wait .ant-steps-item-icon) {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }

        /* Hover card nhẹ */
        .ant-card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default TransactionPage;