import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useVerifyEmail } from '../Hook/useVerifyEmail';
import { useVerifyOpt } from '../Hook/useVerifyOpt';
import { useChangePassword } from '../Hook/useChangePassword';
import { toast } from 'react-toastify';

const { Text, Title } = Typography;

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail({
    onSuccess: () => {
      setStep('otp');
      toast.success('Email hợp lệ, mã OTP đã được gửi!');
    },
    onError: (err) => {
      message.error(`Email không hợp lệ: ${err.message || 'Vui lòng thử lại!'}`);
    }
  });

  const { mutate: verifyOpt, isPending: isVerifyingOpt } = useVerifyOpt({
    onSuccess: () => {
      setStep('password');
      message.success('Xác thực OTP thành công!');
    },
    onError: (err) => {
      message.error(`Xác thực OTP thất bại: ${err.message || 'Vui lòng thử lại!'}`);
    }
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!');
      form.resetFields();
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => onBackToLogin?.(), 1500);
    },
    onError: (err) => {
      message.error(`Đặt lại mật khẩu thất bại: ${err.message || 'Vui lòng thử lại!'}`);
    },
  });

  useEffect(() => {
    if (step === 'otp' && otpRefs[0].current) {
      otpRefs[0].current.focus();
    }
  }, [step]);

  const handleSendCode = async (values: any) => {
    setUserEmail(values.email);
    verifyEmail(values.email);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const newValue = value.replace(/[^0-9]/g, '');

    if (newValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);

      // Auto focus next input
      if (newValue && index < otp.length - 1) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length, 5);
    otpRefs[lastFilledIndex].current?.focus();
  };

  const handleVerifyOtp = async () => {
    if (otp.some(d => d === '')) {
      message.error('Vui lòng nhập đầy đủ 6 số!');
      return;
    }
    const otpCode = Number(otp.join('')); 
    verifyOpt({ email: userEmail, otp: otpCode });
  };

  const handleResetPassword = async (values: any) => {
    const resetData = {
      email: userEmail,
      password: values.newPassword,
      newPassword: values.newPassword
    };
    changePassword(resetData);
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      return;
    }
    verifyEmail(userEmail);
    setOtp(['', '', '', '', '', '']);
    otpRefs[0].current?.focus();
    message.success('Mã OTP đã được gửi lại!');
  };

  const renderEmailStep = () => (
    <>
      <div className="mb-8">
        <Title level={3} className="!text-2xl !font-semibold !text-gray-900 !mb-2">
          Quên mật khẩu
        </Title>
        <Text className="text-gray-600">
          Nhập email của bạn để nhận mã OTP khôi phục mật khẩu.
        </Text>
      </div>

      <Form
        form={form}
        name="forgotPassword"
        onFinish={handleSendCode}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label={<span className="text-sm font-medium text-gray-700">Email</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="example@email.com"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        <Form.Item className="!mb-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={isVerifyingEmail}
            className="w-full h-12 !bg-gray-900 hover:!bg-gray-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Gửi mã OTP
          </Button>
        </Form.Item>

        <div className="text-center pt-6 border-t border-gray-200">
          <Text className="text-sm text-gray-600">
            Đã nhớ mật khẩu?{' '}
            <Button
              type="link"
              onClick={onBackToLogin}
              className="!p-0 !h-auto text-sm font-medium text-gray-900 hover:!text-gray-700 transition-colors hover:underline"
            >
              Đăng nhập ngay
            </Button>
          </Text>
        </div>
      </Form>
    </>
  );

  const renderOtpStep = () => (
    <>
      <div className="mb-8">
        <Title level={3} className="!text-2xl !font-semibold !text-gray-900 !mb-2">
          Nhập mã OTP
        </Title>
        <Text className="text-gray-600">
          Mã OTP đã được gửi đến <span className="font-medium text-gray-900">{userEmail}</span>
        </Text>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Mã xác thực
        </label>
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={otpRefs[index]}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              maxLength={1}
              className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
              style={{ fontSize: '24px' }}
            />
          ))}
        </div>
      </div>

      <Button
        type="primary"
        onClick={handleVerifyOtp}
        loading={isVerifyingOpt}
        className="w-full h-12 !bg-gray-900 hover:!bg-gray-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-4"
      >
        Xác nhận
      </Button>

      <div className="text-center space-y-3">
        <Text className="text-sm text-gray-600 block">
          Không nhận được mã?{' '}
          <Button
            type="link"
            onClick={handleResendCode}
            disabled={isVerifyingEmail}
            className="!p-0 !h-auto text-sm font-medium text-gray-900 hover:!text-gray-700 transition-colors hover:underline"
          >
            Gửi lại
          </Button>
        </Text>

        <div className="pt-3 border-t border-gray-200">
          <Button
            type="link"
            onClick={() => {
              setStep('email');
              setOtp(['', '', '', '', '', '']);
            }}
            className="!p-0 !h-auto text-sm text-gray-600 hover:!text-gray-900 transition-colors"
          >
            ← Thay đổi email
          </Button>
        </div>
      </div>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="mb-8">
        <Title level={3} className="!text-2xl !font-semibold !text-gray-900 !mb-2">
          Đặt lại mật khẩu
        </Title>
        <Text className="text-gray-600">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </Text>
      </div>

      <Form
        form={form}
        name="resetPassword"
        onFinish={handleResetPassword}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="newPassword"
          label={<span className="text-sm font-medium text-gray-700">Mật khẩu mới</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' },
            { max: 20, message: 'Mật khẩu không được quá 20 ký tự!' }
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập mật khẩu mới"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label={<span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</span>}
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Nhập lại mật khẩu mới"
            className="h-12 rounded-lg hover:border-gray-400 focus:border-gray-900 transition-colors"
          />
        </Form.Item>

        <Form.Item className="!mb-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isChangingPassword}
            className="w-full h-12 !bg-gray-900 hover:!bg-gray-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <div className="w-full">
      {step === 'email' && renderEmailStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'password' && renderPasswordStep()}
    </div>
  );
};

export default ForgotPasswordForm;