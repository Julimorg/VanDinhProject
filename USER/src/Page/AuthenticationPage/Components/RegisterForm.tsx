import React from 'react';
import { Form, Input, Button, Typography, DatePicker } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useRegister } from '../Hook/useRegister';
import type { IRegisterRequest } from '../../../Interface/Auth/IRegister'; 
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  confirmPassword: string;
  userDob: Dayjs;
  phone: string;
  userAddress: string;
}

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [form] = Form.useForm<RegisterFormData>();
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister({
    onSuccess: () => {
      toast.success('Đăng ký tài khoản thành công!');
      form.resetFields();
      // onSwitchToLogin?.();
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(`Đăng ký thất bại: ${err.message || 'Vui lòng thử lại!'}`);
    },
  });


  const onFinish = async (values: RegisterFormData) => {

    const formattedValues: IRegisterRequest = {
      ...values,
      userName: values.userName,
      userDob: dayjs(values.userDob).format('YYYY-MM-DD'),
    };
    delete (formattedValues as any).confirmPassword;
    register(formattedValues);
  };

  const emailRules = [
    { required: true, message: 'Vui lòng nhập email!' },
    { type: 'email' as const, message: 'Email không hợp lệ!' },
    { min: 3, message: 'Email phải có ít nhất 3 ký tự!' },
    { max: 30, message: 'Email không được quá 30 ký tự!' },
  ];

  const nameRules = [
    { required: true, message: 'Vui lòng nhập trường này!' },
    { min: 3, message: 'Phải có ít nhất 3 ký tự!' },
    { max: 20, message: 'Không được quá 20 ký tự!' },
  ];

  const userNameRules = [
    { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
    { max: 20, message: 'Tên đăng nhập không được quá 20 ký tự!' },
    { 
      pattern: /^[a-zA-Z0-9_]+$/, 
      message: 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới!' 
    },
  ];

  const passwordRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' },
    { max: 20, message: 'Mật khẩu không được quá 20 ký tự!' },
  ];

  const phoneRules = [
    { required: true, message: 'Vui lòng nhập số điện thoại!' },
    { pattern: /^\d{10}$/, message: 'Số điện thoại phải có đúng 10 chữ số!' },
  ];

  const addressRules = [
    { required: true, message: 'Vui lòng nhập địa chỉ!' }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <Title level={3} className="!text-2xl !font-semibold !text-gray-900 !mb-2">
          Đăng ký tài khoản
        </Title>
        <Text className="text-gray-600">
          Tạo tài khoản mới để bắt đầu mua sắm cùng chúng tôi.
        </Text>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        {/* Email */}
        <Form.Item
          name="email"
          label={<span className="text-sm font-medium text-gray-700">Email</span>}
          rules={emailRules}
        >
          <Input 
            prefix={<MailOutlined className="text-gray-400" />} 
            placeholder="example@email.com"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label={<span className="text-sm font-medium text-gray-700">Họ</span>}
            rules={nameRules}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Nguyễn"
              className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<span className="text-sm font-medium text-gray-700">Tên</span>}
            rules={nameRules}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Văn A"
              className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
            />
          </Form.Item>
        </div>

        {/* Username */}
        <Form.Item
          name="userName"
          label={<span className="text-sm font-medium text-gray-700">Tên đăng nhập</span>}
          rules={userNameRules}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="username123"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label={<span className="text-sm font-medium text-gray-700">Mật khẩu</span>}
          rules={passwordRules}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Nhập mật khẩu"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={<span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>}
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Nhập lại mật khẩu"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        {/* Date of Birth & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="userDob"
            label={<span className="text-sm font-medium text-gray-700">Ngày sinh</span>}
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY" 
              placeholder="Chọn ngày sinh"
              className="w-full h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-sm font-medium text-gray-700">Số điện thoại</span>}
            rules={phoneRules}
          >
            <Input 
              prefix={<PhoneOutlined className="text-gray-400" />} 
              placeholder="912345678"
              maxLength={10}
              className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
            />
          </Form.Item>
        </div>

        {/* Address */}
        <Form.Item
          name="userAddress"
          label={<span className="text-sm font-medium text-gray-700">Địa chỉ</span>}
          rules={addressRules}
        >
          <Input.TextArea 
            placeholder="Nhập địa chỉ của bạn"
            rows={3}
            className="rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors resize-none"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="!mb-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isPending}
            className="w-full h-12 !bg-gray-900 hover:!bg-gray-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Đăng ký tài khoản
          </Button>
        </Form.Item>

        {/* Login Link */}
        <div className="text-center pt-6 border-t border-gray-200">
          <Text className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Button 
              type="link"
              onClick={onSwitchToLogin}
              className="!p-0 !h-auto text-sm font-medium text-gray-900 hover:!text-gray-700 transition-colors hover:underline"
            >
              Đăng nhập ngay
            </Button>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;