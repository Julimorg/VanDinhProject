import { Icons } from '@/Components/Icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Loading from '@/Components/Loading/index';
import { useLogin } from '@/Auth/Login/Hook/useLogin';
import { useLanguage } from './Hook/usegetLanguage';
import { useAuthStore } from '@/Store/auth';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: languageData } = useLanguage();
  const setLanguageId = useAuthStore((state) => state.setLanguageId);

  const loginMutation = useLogin();
  const { Option } = Icons.Select;

  const codeMap: Record<string, string> = {
    vi: 'vi-VN',
    en: 'en-US',
  };

  useEffect(() => {
    if (!languageData?.data) return;

    const matchedLang = languageData.data.find((lang) => lang.code === codeMap[i18n.language]);

    if (matchedLang) {
      setLanguageId(matchedLang.id);
      // console.log('Đã lưu languageId :', matchedLang.id);
    }
  }, [languageData, i18n.language, setLanguageId]);

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
          toast.success(t('login.loginSuccess') || 'Đăng nhập thành công');
          navigate('/tickets');
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error(t('login.loginFailed') || 'Đăng nhập thất bại');
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      {loading && <Loading />}

      <div className="relative flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="absolute flex items-center space-x-3 -translate-x-1/2 top-6 left-1/2">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide text-gray-800">ZENTRY</h1>
        </div>

        <Icons.Select
          defaultValue={i18n.language}
          onChange={(lng) => {
            i18n.changeLanguage(lng);
            const matchedLang = languageData?.data?.find((lang) => lang.code === codeMap[lng]);
            if (matchedLang) {
              setLanguageId(matchedLang.id);
            }
          }}
          className="absolute w-40 bg-white rounded-md shadow-sm top-6 right-6"
        >
          <Option value="vi">
            <span className="mr-2 flag-icon flag-icon-vn"></span>
            {t('language.vi')}
          </Option>
          <Option value="en">
            <span className="mr-2 flag-icon flag-icon-gb"></span>
            {t('language.en')}
          </Option>
        </Icons.Select>

        <div className="w-full max-w-md p-8 transition-all duration-300 transform bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800">{t('login.title')}</h2>
          <p className="mb-6 text-sm text-center text-gray-500">{t('login.description')}</p>

          <Icons.Form layout="vertical" onFinish={onFinish}>
            <Icons.Form.Item
              label={t('login.username')}
              name="username"
              rules={[{ required: true, message: t('login.usernamePlaceholder') }]}
            >
              <Icons.Input
                placeholder={t('login.usernamePlaceholder')}
                className="transition-all duration-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </Icons.Form.Item>

            <Icons.Form.Item
              label={t('login.password')}
              name="password"
              rules={[{ required: true, message: t('login.passwordPlaceholder') }]}
            >
              <Icons.Input.Password
                placeholder={t('login.passwordPlaceholder')}
                className="transition-all duration-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </Icons.Form.Item>

            <Icons.Form.Item>
              <Icons.Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {t('login.loginButton')}
              </Icons.Button>
            </Icons.Form.Item>
          </Icons.Form>

          {/* <p className="mt-4 text-sm text-center text-gray-500">{t('login.needHelp')}</p> */}

          <Icons.Divider className="my-4 border-gray-200" />

          <p className="text-xs text-center text-gray-400">{t('login.copyright')}</p>
        </div>
      </div>
    </>
  );
};

export default Login;
