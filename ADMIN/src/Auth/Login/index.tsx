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
      console.log('Đã lưu languageId :', matchedLang.id);
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
          toast.success(t('login.loginSuccess') || 'Login successful');
          navigate('/dashboard');
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error(t('login.loginFailed') || 'Login failed');
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      {loading && <Loading />}

      <div className="relative flex items-center justify-center min-h-screen bg-loginbg">
        <div className="absolute flex items-center space-x-4 top-10">
          <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg">
            <span className="text-3xl font-bold text-pink-100">Z</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wide text-white">ZENTRY</h1>
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
          className="absolute w-40 top-6 right-6"
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

        <div className=" max-w-[40rem] w-full p-8 bg-white shadow-md h-[40rem] rounded-xl">
          <h2 className="text-[45px] font-bold text-center text-gray-800">{t('login.title')}</h2>
          <p className="mb-6 text-sm text-center text-gray-500">{t('login.description')}</p>

          <Icons.Form layout="vertical" onFinish={onFinish} className='mb-20 '>
            <Icons.Form.Item
              label={<span style={{ fontSize: '18px', fontWeight: 600, color: '#4b5563' }}>{t('login.username')}</span>}
              name="username"
            
              rules={[{ required: true, message: t('login.usernamePlaceholder') }]}
            >
              <Icons.Input placeholder={t('login.usernamePlaceholder')}  className="h-16 px-4 text-lg"/>
            </Icons.Form.Item>

            <Icons.Form.Item
              label={<span style={{ fontSize: '18px', fontWeight: 600, color: '#4b5563' }}>{t('login.password')}</span>}
              name="password"
              rules={[{ required: true, message: t('login.passwordPlaceholder') }]}
              className='mb-[3rem]'
            >
              <Icons.Input.Password placeholder={t('login.passwordPlaceholder')} className="h-16 px-4 text-lg" />
            </Icons.Form.Item>

            <Icons.Form.Item>
              <Icons.Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-16 px-4 text-lg bg-green-600 hover:bg-green-700"
              >
                {t('login.loginButton')}
              </Icons.Button>
            </Icons.Form.Item>
          </Icons.Form>

          <p className="text-sm text-center text-gray-500">{t('login.needHelp')}</p>

          <Icons.Divider style={{ margin: 10, borderTop: '1px solid #e0e0e0' }} />

          <p className="mt-2 text-xs text-center text-gray-400">{t('login.copyright')}</p>
        </div>
      </div>
    </>
  );
};

export default Login;
