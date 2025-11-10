import React from 'react';
import { useLogin } from '@/Auth/Login/Hook/useLogin';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/Components/Icons';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  showLoading: (show: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, showLoading }) => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const onFinish = (values: { username: string; password: string }) => {
    showLoading(true);
    loginMutation.mutate(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => {
          showLoading(false);
          toast.success('Đăng nhập thành công');
          navigate('/tickets');
        },
        onError: (error: any) => {
          showLoading(false);
          toast.error('Đăng nhập thất bại');
          console.error(error);
        },
      }
    );
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Giả sử route quên mật khẩu
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Đăng nhập</h2>
      <p className="mb-6 text-sm text-center text-gray-500">Chào mừng bạn quay lại với Cửa hàng sơn Vạn Dinh</p>

      <Icons.Form layout="vertical" onFinish={onFinish}>
        <Icons.Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Icons.Input
            placeholder="Nhập tên đăng nhập"
            className="transition-all duration-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </Icons.Form.Item>

        <Icons.Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Icons.Input.Password
            placeholder="Nhập mật khẩu"
            className="transition-all duration-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </Icons.Form.Item>

        <Icons.Form.Item>
          <Icons.Button
            type="primary"
            htmlType="submit"
            className="w-full font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng nhập
          </Icons.Button>
        </Icons.Form.Item>
      </Icons.Form>

      {/* Nút Quên mật khẩu */}
      <div className="mt-4 text-center">
        <Icons.Button
          type="link"
          onClick={handleForgotPassword}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Quên mật khẩu?
        </Icons.Button>
      </div>

      {/* Nút Đăng ký */}
      <div className="flex justify-center mt-4">
        <Icons.Button
          type="link"
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Đăng ký tài khoản mới
        </Icons.Button>
      </div>
    </>
  );
};

export default LoginForm;