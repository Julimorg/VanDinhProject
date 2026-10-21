import React, { useState } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import ForgotPasswordForm from './Components/ForgotPassForm';
import { AuthFormType } from '../../Enum/AuthEnum';
import ThreeHero from '../../Components/ThreeHero/ThreeHero';

const highlights = [
  { icon: <CheckCircleRoundedIcon />, title: 'Chất lượng đảm bảo', desc: 'Sản phẩm chính hãng, uy tín hàng đầu' },
  { icon: <LocalShippingRoundedIcon />, title: 'Giao hàng nhanh chóng', desc: 'Đặt hàng dễ dàng, nhận hàng tận nơi' },
  { icon: <SupportAgentRoundedIcon />, title: 'Hỗ trợ tư vấn', desc: 'Đội ngũ chuyên nghiệp, nhiệt tình' },
];

const AuthPage: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<AuthFormType>(AuthFormType.LOGIN);

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  const backButtonVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const renderForm = () => (
    <AnimatePresence mode="wait">
      <motion.div key={currentForm} variants={formVariants} initial="hidden" animate="visible" exit="exit">
        {currentForm === AuthFormType.LOGIN && (
          <LoginForm
            onSwitchToRegister={() => setCurrentForm(AuthFormType.REGISTER)}
            onSwitchToForgot={() => setCurrentForm(AuthFormType.FORGOT_PASSWORD)}
          />
        )}
        {currentForm === AuthFormType.REGISTER && (
          <RegisterForm onSwitchToLogin={() => setCurrentForm(AuthFormType.LOGIN)} />
        )}
        {currentForm === AuthFormType.FORGOT_PASSWORD && (
          <ForgotPasswordForm onBackToLogin={() => setCurrentForm(AuthFormType.LOGIN)} />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'stone.50', display: 'flex', alignItems: 'center', py: { xs: 6, md: 0 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: { xs: 0, lg: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left - Branding */}
          <motion.div variants={headerVariants} initial="hidden" animate="visible">
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                position: 'relative',
                minHeight: 520,
                bgcolor: 'stone.900',
                borderRadius: 4,
                p: 6,
                overflow: 'hidden',
                color: 'white',
              }}
            >
              <ThreeHero />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div variants={childVariants}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 2 }}>
                    Vạn Đinh Paint
                  </Typography>
                  <Typography variant="h2" sx={{ color: 'white', fontSize: '2.75rem', mb: 2 }}>
                    Cửa hàng sơn<br />chính hãng, giao tận nơi
                  </Typography>
                  <Typography sx={{ color: 'stone.300', fontSize: '1rem', lineHeight: 1.7, maxWidth: 420 }}>
                    Sơn chất lượng cao, đa dạng màu sắc và dịch vụ tư vấn chuyên nghiệp cho mọi công trình của bạn.
                  </Typography>
                </motion.div>

                <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {highlights.map((h) => (
                    <motion.div key={h.title} variants={childVariants}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ color: 'primary.main', mt: 0.25 }}>{h.icon}</Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.92rem' }}>{h.title}</Typography>
                          <Typography sx={{ color: 'stone.400', fontSize: '0.82rem' }}>{h.desc}</Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Right - Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
              <Box sx={{ display: { xs: 'block', lg: 'none' }, textAlign: 'center', mb: 4 }}>
                <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 1 }}>
                  Vạn Đinh Paint
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.6rem', color: 'stone.900' }}>
                  Cửa hàng sơn Vạn Đinh
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Chất lượng - Uy tín - Chuyên nghiệp</Typography>
              </Box>

              {currentForm !== AuthFormType.LOGIN && (
                <motion.div variants={backButtonVariants} initial="hidden" animate="visible">
                  <Box
                    component="button"
                    onClick={() => setCurrentForm(AuthFormType.LOGIN)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      mb: 3,
                      p: 0,
                      '&:hover': { color: 'stone.900' },
                    }}
                  >
                    <ArrowBackRoundedIcon fontSize="small" /> Quay lại đăng nhập
                  </Box>
                </motion.div>
              )}

              {renderForm()}
            </Paper>

            <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.8rem', color: 'text.secondary' }}>
              © {new Date().getFullYear()} Cửa hàng sơn Vạn Đinh. All rights reserved.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
