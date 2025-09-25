import { useAuthStore } from '@/Store/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import type { EditUserRequest } from '@/Interface/TEditUser';
import { useUpdateAdminProfile } from './Hook/useUpdateProfile';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const userName = useAuthStore((state) => state.userName);
  const user_id = useAuthStore((state) => state.user_id);
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending, error } = useUpdateAdminProfile(user_id ?? '', {
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Cập nhật hồ sơ thành công!');
      form.resetFields();
    },
    onError: (err) => {
      toast.error(err.response?.data.message || 'Cập nhật thất bại');
      setSubmitted(false);
    },
  });

  const handleSubmit = (values: EditUserRequest) => {
    mutate(values);
    console.log(submitted);
  };

  const handleBack = () => {
    navigate('/tickets');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card
        style={{ width: '100%', maxWidth: 500, padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        title={
          <Title level={3} style={{ textAlign: 'center', color: '#1d39c4' }}>
            Chỉnh sửa thông tin
          </Title>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card style={{ background: '#fafafa', borderColor: '#e8e8e8' }}>
            <Space direction="vertical">
              <Text strong>Tên người dùng:</Text>
              <Text>{userName}</Text>
            </Space>
          </Card>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ fullName: '', email: '' }}
          >
            <Form.Item
              label="Họ và Tên"
              name="fullName"
              rules={[
                { required: true, message: 'Họ và tên là bắt buộc.' },
              ]}
            >
              <Input placeholder="Nhập họ và tên ..." size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Email là bắt buộc.' },
                { type: 'email', message: 'Định dạng email không hợp lệ.' },
              ]}
            >
              <Input placeholder="Nhập email ..." size="large" />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  type="default"
                  onClick={handleBack}
                  size="large"
                >
                  Trở về trang chủ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  size="large"
                >
                  {isPending ? 'Đang xử lý...' : 'Submit'}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {error && (
            <Text type="danger" style={{ textAlign: 'center', display: 'block' }}>
              Lỗi: {error.response?.data.message || 'Cập nhật thất bại'}
            </Text>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default EditProfile;