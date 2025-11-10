import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToForgot }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Đăng nhập:', values);
      // TODO: API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Đăng nhập thành công!');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <Title level={3} className="!text-2xl !font-semibold !text-gray-900 !mb-2">
          Đăng nhập
        </Title>
        <Text className="text-gray-600">
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
        </Text>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        className="space-y-1"
      >
        <Form.Item
          name="username"
          label={
            <span className="text-sm font-medium text-gray-700">
              Tên đăng nhập
            </span>
          }
          rules={[
            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
            { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Nhập tên đăng nhập của bạn" 
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <span className="text-sm font-medium text-gray-700">
              Mật khẩu
            </span>
          }
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Nhập mật khẩu của bạn" 
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        <div className="flex items-center justify-end mb-6">
          <Button 
            type="link" 
            onClick={onSwitchToForgot}
            className="!p-0 !h-auto text-sm text-gray-600 hover:!text-gray-900 transition-colors"
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Form.Item className="!mb-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full h-12 !bg-gray-900 hover:!bg-gray-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="text-center pt-6 border-t border-gray-200">
          <Text className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Button 
              type="link"
              onClick={onSwitchToRegister}
              className="!p-0 !h-auto text-sm font-medium text-gray-900 hover:!text-gray-700 transition-colors hover:underline"
            >
              Đăng ký ngay
            </Button>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;