import React from 'react';
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs nếu chưa
import { toast } from 'react-toastify';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd'; // Import trực tiếp
import type { FormProps } from 'antd'; // Type cho Form

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  showLoading: (show: boolean) => void;
}

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  userDob: Dayjs;
  phone: string;
  userAddress: string;
}

type FieldType = FormProps['fields'][number]['name'];

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, showLoading }) => {
  const [form] = Form.useForm<RegisterFormData>();

  const onFinish = (values: RegisterFormData) => {
    showLoading(true);
    // Log dữ liệu để test - Bạn thay bằng hook thực tế ở đây
    console.log('Dữ liệu đăng ký:', {
      ...values,
      userDob: values.userDob.format('YYYY-MM-DD'),
    });
    
    // Giả lập success - Thay bằng logic hook mutate
    setTimeout(() => { // Delay giả lập API call
      showLoading(false);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      form.resetFields(); // Reset form sau submit
      onSwitchToLogin(); // Switch về login
    }, 1500);
  };

  // Validation rules (giữ nguyên)
  const emailRules = [
    { required: true, message: 'Vui lòng nhập email!' },
    { type: 'email', message: 'Email không hợp lệ!' },
    { min: 3, message: 'Email phải ít nhất 3 ký tự!' },
    { max: 20, message: 'Email tối đa 20 ký tự!' },
  ];

  const nameRules = (fieldName: string) => [
    { required: true, message: `Vui lòng nhập ${fieldName}!` },
    { min: 3, message: `${fieldName} phải ít nhất 3 ký tự!` },
    { max: 20, message: `${fieldName} tối đa 20 ký tự!` },
  ];

  const userNameRules = [
    ...nameRules('Tên người dùng'),
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên người dùng chỉ chứa chữ cái, số và dấu gạch dưới!' },
  ];

  const passwordRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 5, message: 'Mật khẩu phải ít nhất 5 ký tự!' },
    { max: 20, message: 'Mật khẩu tối đa 20 ký tự!' },
  ];

  const phoneRules = [
    { required: true, message: 'Vui lòng nhập số điện thoại!' },
    { pattern: /^\d{9}$/, message: 'Số điện thoại phải đúng 9 chữ số!' },
  ];

  const addressRules = [{ required: true, message: 'Vui lòng nhập địa chỉ!' }];

  return (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Đăng ký tài khoản</h2>
      <p className="mb-6 text-sm text-center text-gray-500">Tạo tài khoản để mua sắm ngay hôm nay!</p>

      <Form<RegisterFormData>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6" // Spacing rộng rãi
        size="large"
      >
        {/* Row cho FirstName và LastName - Sử dụng AntD Row/Col */}
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              name="firstName"
              rules={nameRules('Họ')}
            >
              <Input placeholder="Họ (First Name)" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              name="lastName"
              rules={nameRules('Tên')}
            >
              <Input placeholder="Tên (Last Name)" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item<FieldType> name="userName" rules={userNameRules}>
          <Input placeholder="Tên đăng nhập (User Name)" className="w-full" />
        </Form.Item>

        <Form.Item<FieldType> name="email" rules={emailRules}>
          <Input placeholder="Email" className="w-full" />
        </Form.Item>

        <Form.Item<FieldType> name="password" rules={passwordRules}>
          <Input.Password placeholder="Mật khẩu" className="w-full" />
        </Form.Item>

        <Form.Item<FieldType> name="userDob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker
            placeholder="Ngày sinh (YYYY-MM-DD)"
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item<FieldType> name="phone" rules={phoneRules}>
          <Input placeholder="Số điện thoại (9 số)" className="w-full" />
        </Form.Item>

        <Form.Item<FieldType> name="userAddress" rules={addressRules}>
          <Input.TextArea placeholder="Địa chỉ" rows={3} className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng Ký Tài Khoản
          </Button>
        </Form.Item>
      </Form>

      {/* Nút Đã có tài khoản? */}
      <div className="flex justify-center mt-4">
        <Button
          type="link"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Đã có tài khoản? Đăng nhập ngay
        </Button>
      </div>
    </>
  );
};

export default RegisterForm;