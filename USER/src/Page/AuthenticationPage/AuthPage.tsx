import React, { useState } from 'react';
import { Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import ForgotPasswordForm from './Components/ForgotPassForm';
import { AuthFormType } from '../../Enum/AuthEnum';

const { Title, Paragraph } = Typography;

const AuthPage: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<AuthFormType>(AuthFormType.LOGIN);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  const renderForm = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentForm}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        {currentForm === AuthFormType.LOGIN && (
          <LoginForm 
            onSwitchToRegister={() => setCurrentForm(AuthFormType.REGISTER)} 
            onSwitchToForgot={() => setCurrentForm(AuthFormType.FORGOT_PASSWORD)} 
          />
        )}
        {currentForm === AuthFormType.REGISTER && (
          <RegisterForm />
        )}
        {currentForm === AuthFormType.FORGOT_PASSWORD && (
          <ForgotPasswordForm />
        )}
      </motion.div>
    </AnimatePresence>
  );

  const backButtonVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.3 } 
    },
  };

  const renderBackButton = () => (
    currentForm !== AuthFormType.LOGIN && (
      <motion.div
        variants={backButtonVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <button 
          onClick={() => setCurrentForm(AuthFormType.LOGIN)} 
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
        >
          <ArrowLeftOutlined className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" /> 
          Quay lại đăng nhập
        </button>
      </motion.div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Branding */}
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block space-y-8"
          >
            <motion.div variants={childVariants} className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-xl">
                <svg 
                  className="w-9 h-9 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
              
              <Title level={1} className="!text-5xl !font-bold !text-gray-900 !mb-0 leading-tight">
                Cửa hàng sơn<br />Vạn Dinh
              </Title>
              
              <Paragraph className="!text-lg !text-gray-600 !mb-0 leading-relaxed max-w-md">
                Nơi cung cấp sơn chất lượng cao, đa dạng màu sắc và dịch vụ tư vấn chuyên nghiệp cho mọi công trình của bạn.
              </Paragraph>
            </motion.div>

            <motion.div variants={childVariants} className="space-y-4 pt-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Chất lượng đảm bảo</h3>
                  <p className="text-gray-600 text-sm">Sản phẩm chính hãng, uy tín hàng đầu</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Giao hàng nhanh chóng</h3>
                  <p className="text-gray-600 text-sm">Đặt hàng dễ dàng, nhận hàng tận nơi</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hỗ trợ tư vấn</h3>
                  <p className="text-gray-600 text-sm">Đội ngũ chuyên nghiệp, nhiệt tình</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white py-12 px-8 sm:px-12 shadow-sm rounded-2xl border border-gray-200">
              
              {/* Mobile Header */}
              <div className="lg:hidden mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-xl mb-4">
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                </div>
                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                  Cửa hàng sơn Vạn Dinh
                </Title>
                <Paragraph className="!text-gray-600 !mb-0">
                  Chất lượng - Uy tín - Chuyên nghiệp
                </Paragraph>
              </div>

              <div className="space-y-6">
                {renderBackButton()}
                {renderForm()}
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              © 2024 Cửa hàng sơn Vạn Dinh. All rights reserved.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;