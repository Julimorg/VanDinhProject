import React from 'react';
import { Form, Input, Button, DatePicker, Typography, Card, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, LockOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'antd/dist/reset.css'; // Import Ant Design styles

const { Title } = Typography;
const { Link } = Typography;

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  userDob: Dayjs; // Sử dụng Dayjs cho DatePicker
  phone: string;
  userAddress: string;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<RegisterFormData>();

  const onFinish = (values: RegisterFormData) => {
    // Giả lập submit - kết nối API backend ở đây
    console.log('Dữ liệu đăng ký:', {
      ...values,
      userDob: values.userDob?.format('YYYY-MM-DD'), // Chuyển Dayjs thành string YYYY-MM-DD
    });
    // Ví dụ: await api.registerUser(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi validation:', errorInfo);
  };

  // Validation rules cho từng trường
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
    { pattern: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ ƯỬỮỰỲỴÝỶỸ\s]+$/, message: `${fieldName} chỉ chứa chữ cái và khoảng trắng!` },
  ];

  const userNameRules = [
    ...nameRules('Tên người dùng'),
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên người dùng chỉ chứa chữ cái, số và dấu gạch dưới!' },
    // Thêm async rule cho check duplicates (kết nối API)
    // {
    //   validator: async (_, value) => {
    //     if (!value) return Promise.resolve();
    //     return api.checkUsername(value).then(res => res.available ? Promise.resolve() : Promise.reject('Tên người dùng đã tồn tại!'));
    //   },
    // },
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

  const addressRules = [
    { required: true, message: 'Vui lòng nhập địa chỉ!' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl"> {/* Tăng từ md lên xl để rộng hơn */}
        {/* Tựa đề responsive */}
        <div className="text-center">
          <Title level={2} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Cửa Hàng Sơn Vạn Định
          </Title>
          <p className="text-sm text-gray-600">Đăng ký tài khoản để mua sắm ngay hôm nay!</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl"> {/* Tăng từ md lên xl */}
        <Card className="shadow-lg rounded-lg p-8 bg-white"> {/* Tăng padding từ p-6 lên p-8 */}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            className="space-y-6"
          >
            {/* Row cho FirstName và LastName - Responsive, rộng hơn */}
            <Row gutter={24}> {/* Tăng gutter từ 16 lên 24 để khoảng cách ngang thoải mái */}
              <Col xs={24} sm={12}>
                <Form.Item name="firstName" rules={nameRules('Họ')}>
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Họ (First Name)"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="lastName" rules={nameRules('Tên')}>
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Tên (Last Name)"
                    className="w-full"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* UserName */}
            <Form.Item name="userName" rules={userNameRules}>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Tên đăng nhập (User Name)"
                className="w-full"
              />
            </Form.Item>

            {/* Email */}
            <Form.Item name="email" rules={emailRules}>
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                className="w-full"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item name="password" rules={passwordRules}>
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                className="w-full"
              />
            </Form.Item>

            {/* Ngày sinh */}
            <Form.Item
              name="userDob"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker
                placeholder="Ngày sinh (YYYY-MM-DD)"
                format="YYYY-MM-DD"
                prefix={<CalendarOutlined className="text-gray-400" />}
                className="w-full"
                style={{ height: '40px' }}
              />
            </Form.Item>

            {/* Phone */}
            <Form.Item name="phone" rules={phoneRules}>
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Số điện thoại (9 số)"
                className="w-full"
              />
            </Form.Item>

            {/* Địa chỉ */}
            <Form.Item name="userAddress" rules={addressRules}>
              <Input.TextArea
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                placeholder="Địa chỉ"
                rows={3}
                className="w-full"
              />
            </Form.Item>

            {/* Nút Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
                size="large"
              >
                Đăng Ký Tài Khoản
              </Button>
            </Form.Item>
          </Form>

          {/* Nút "Đã có tài khoản?" - Responsive */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;