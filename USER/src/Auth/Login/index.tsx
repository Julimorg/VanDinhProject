import { Icons } from '@/Components/Icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '@/Components/Loading/index';
import { useLogin } from '@/Auth/Login/Hook/useLogin';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    loginMutation.mutate(
      {
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success('Đăng nhập thành công');
          navigate('/tickets');
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error('Đăng nhập thất bại');
          console.error(error);
        },
      }
    );
  };

  const handleRegister = () => {
    navigate('/register'); // Giả sử route đăng ký
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Giả sử route quên mật khẩu
  };

  return (
    <>
      {loading && <Loading />}

      <div className="relative flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header với logo */}
        <div className="absolute flex flex-col items-center space-y-2 -translate-x-1/2 top-6 left-1/2 md:flex-row md:space-y-0 md:space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 md:w-16 md:h-16">
            <span className="text-2xl font-bold text-white md:text-3xl">S</span> {/* Icon tượng trưng cho sơn */}
          </div>
          <h1 className="text-xl font-extrabold tracking-wide text-gray-800 md:text-2xl">Cửa hàng sơn Vạn Dinh</h1>
        </div>

        {/* Form container - Responsive cho tablet và mobile */}
        <div className="w-full max-w-md px-4 mx-auto transition-all duration-300 transform bg-white shadow-xl rounded-xl sm:px-6 lg:max-w-lg">
          <div className="p-6 md:p-8">
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
                  loading={loading}
                  className="w-full font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Đăng nhập
                </Icons.Button>
              </Icons.Form.Item>
            </Icons.Form>

            {/* Các nút thêm */}
            <div className="flex flex-col space-y-3 mt-4 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-center">
              <Icons.Button
                type="link"
                onClick={handleRegister}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                disabled={loading}
              >
                Đăng ký tài khoản mới
              </Icons.Button>
              <Icons.Button
                type="link"
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                disabled={loading}
              >
                Quên mật khẩu?
              </Icons.Button>
            </div>

            <Icons.Divider className="my-6 border-gray-200" />

            <p className="text-xs text-center text-gray-400">
              © 2025 Cửa hàng sơn Vạn Dinh. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;