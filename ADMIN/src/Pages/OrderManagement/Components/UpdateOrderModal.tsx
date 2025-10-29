// UpdateOrderModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, Typography, Button, message, Spin, Card, Space, Divider } from 'antd';
import { ShoppingOutlined, UserOutlined, CreditCardOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useUpdateOrder } from '../Hook/useUpdateOrder';
import { useGetUserSelections } from '../Hook/useGetUserSelection';
import { docApi } from '@/Api/docApi';
import type { IUpdateOrderRequest } from '@/Interface/Order/IUpdateOrder';
import type { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { toast } from 'react-toastify';
const { Title, Text } = Typography;
const { Option } = Select;

interface UpdateOrderForm {
  userId: string;
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL';
  shipAddress: string;
}

interface UpdateOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess?: () => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  open,
  onClose,
  orderId,
  onSuccess,
}) => {
  const [form] = Form.useForm<UpdateOrderForm>();
  const [orderData, setOrderData] = useState<IGetOrderDetailResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const { data: userData, isLoading: loadingUsers } = useGetUserSelections();

  const updateOrderMutation = useUpdateOrder(orderId, {
    onSuccess: () => {
      toast.success('Cập nhật đơn hàng thành công!');
      onClose();
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(`Cập nhật thất bại: ${err.message || 'Có lỗi xảy ra'}`);
    },
  });

  const loading = updateOrderMutation.isPending || loadingUsers || loadingOrder;

  useEffect(() => {
    if (!open) return;

    const fetchOrderDetail = async () => {
      try {
        setLoadingOrder(true);
        const res = await docApi.GetOrderDetail(orderId);
        setOrderData(res.data);
        form.setFieldsValue({
          userId: res.data.id,
          paymentMethod: res.data.paymentMethod ?? 'CASH',
          shipAddress: res.data.shipAddress ?? '',
        });
      } catch (err) {
        message.error('Không thể load chi tiết đơn hàng');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrderDetail();
  }, [open, orderId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: IUpdateOrderRequest = {
        id: values.userId,
        paymentMethod: values.paymentMethod,
        shipAddress: values.shipAddress,
      };
      await updateOrderMutation.mutateAsync(payload);
    } catch (error: any) {
      message.error(`Cập nhật thất bại: ${error.message || error}`);
    }
  };

  return (
    <Modal
      title={
        <Space align="center" style={{ width: '100%' }}>
          <ShoppingOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
            Cập nhật đơn hàng
          </Title>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="95%"
      style={{ maxWidth: '900px', top: 20 }}
      centered
      destroyOnClose
      styles={{
        body: { 
          padding: '24px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }
      }}
    >
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px' 
        }}>
          <Space direction="vertical" align="center" size="large">
            <Spin size="large" />
            <Text type="secondary">Đang tải thông tin...</Text>
          </Space>
        </div>
      ) : (
        <>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              marginBottom: '24px',
              borderRadius: '12px'
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                Mã đơn hàng
              </Text>
              <Title level={3} style={{ margin: 0, color: '#fff', wordBreak: 'break-all' }}>
                #{orderId}
              </Title>
            </Space>
          </Card>

          <Form form={form} layout="vertical">
            <Card 
              bordered={false}
              style={{ 
                marginBottom: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Space direction="vertical" size="small" style={{ marginBottom: '16px' }}>
                <Space>
                  <UserOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
                  <Text strong style={{ fontSize: '16px' }}>Thông tin khách hàng</Text>
                </Space>
              </Space>
              
              <Row gutter={[16, 0]}>
                <Col xs={24} lg={24}>
                  <Form.Item 
                    name="userId" 
                    label="Khách hàng" 
                    rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                  >
                    <Select 
                      placeholder="Chọn khách hàng"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {userData?.data?.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.userName})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card 
              bordered={false}
              style={{ 
                marginBottom: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Space direction="vertical" size="small" style={{ marginBottom: '16px' }}>
                <Space>
                  <CreditCardOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                  <Text strong style={{ fontSize: '16px' }}>Phương thức thanh toán</Text>
                </Space>
              </Space>
              
              <Row gutter={[16, 0]}>
                <Col xs={24} lg={24}>
                  <Form.Item 
                    name="paymentMethod" 
                    label="Phương thức" 
                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                  >
                    <Select placeholder="Chọn phương thức" size="large">
                      <Option value="CASH">
                        <Space>
                          💵 Tiền mặt (COD)
                        </Space>
                      </Option>
                      <Option value="VN_PAY">
                        <Space>
                          🏦 VNPAY
                        </Space>
                      </Option>
                      <Option value="PAY_PAL">
                        <Space>
                          💳 PAYPAL
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card 
              bordered={false}
              style={{ 
                marginBottom: '24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Space direction="vertical" size="small" style={{ marginBottom: '16px' }}>
                <Space>
                  <EnvironmentOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
                  <Text strong style={{ fontSize: '16px' }}>Địa chỉ giao hàng</Text>
                </Space>
              </Space>
              
              <Row gutter={[16, 0]}>
                <Col xs={24}>
                  <Form.Item
                    name="shipAddress"
                    label="Địa chỉ chi tiết"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                  >
                    <Input.TextArea
                      rows={4}
                      style={{ resize: 'none', borderRadius: '6px' }}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={[12, 12]} justify="end">
              <Col xs={12} sm={8} md={6}>
                <Button 
                  block
                  size="large"
                  onClick={onClose} 
                  disabled={loading}
                  style={{ borderRadius: '6px' }}
                >
                  Hủy bỏ
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Button 
                  block
                  type="primary" 
                  size="large"
                  onClick={handleSubmit} 
                  loading={loading}
                  style={{ borderRadius: '6px' }}
                  icon={<ShoppingOutlined />}
                >
                  Lưu thay đổi
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default UpdateOrderModal;