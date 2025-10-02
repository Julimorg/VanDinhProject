import { Icons } from '@/Components/Icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '@/Components/Loading/index';
import { useLogin } from './Hook/useLogin';

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
          toast.success("Login Successfully!");
          navigate('/dashboard');
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error("Login Failed!");
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      {loading && <Loading />}

      <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Left Side - Branding & Image */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 xl:p-12 items-center justify-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 xl:w-72 xl:h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 xl:w-96 xl:h-96 bg-orange-400 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-xl text-white">
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl border border-white border-opacity-30">
                <span className="text-3xl xl:text-4xl font-bold text-white">V</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight">VẠN ĐỊNH</h1>
            </div>
            
            <h2 className="text-2xl xl:text-3xl font-bold mb-4 leading-tight">
              Giải pháp sơn chuyên nghiệp<br />cho mọi công trình
            </h2>
            
            <p className="text-base xl:text-lg text-blue-100 mb-8 leading-relaxed">
              Hệ thống quản lý bán hàng hiện đại, giúp bạn kiểm soát kho hàng, 
              đơn hàng và khách hàng một cách dễ dàng và hiệu quả.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base xl:text-lg">Quản lý kho hàng thông minh</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base xl:text-lg">Theo dõi đơn hàng realtime</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-base xl:text-lg">Báo cáo chi tiết & phân tích</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                VẠN ĐỊNH
              </h1>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Login
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Please log in to start your shift
                </p>
              </div>

              <Icons.Form layout="vertical" onFinish={onFinish}>
                <Icons.Form.Item
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      UserName
                    </span>
                  }
                  name="username"
                  rules={[{ required: true, message: "Your user name..." }]}
                  className="mb-5"
                >
                  <Icons.Input
                    placeholder="Your user name..."
                    size="large"
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </Icons.Form.Item>

                <Icons.Form.Item
                  label={
                    <span className="text-sm font-semibold text-gray-700">
                      Password
                    </span>
                  }
                  name="password"
                  rules={[{ required: true, message: "Your password..." }]}
                  className="mb-6"
                >
                  <Icons.Input.Password
                    placeholder="Your password..."
                    size="large"
                    style={{ height: '48px', fontSize: '16px' }}
                  />
                </Icons.Form.Item>

                <Icons.Form.Item className="mb-0">
                  <Icons.Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                      background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                      border: 'none',
                    }}
                  >
                    Login
                  </Icons.Button>
                </Icons.Form.Item>
              </Icons.Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Having trouble? Contact Admin </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">@ 2025 - VanDinh - Paint Store Management System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;