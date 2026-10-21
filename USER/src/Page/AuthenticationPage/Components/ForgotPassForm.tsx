import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Divider } from '@mui/material';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useVerifyEmail } from '../Hook/useVerifyEmail';
import { useVerifyOpt } from '../Hook/useVerifyOpt';
import { useChangePassword } from '../Hook/useChangePassword';
import { toast } from 'react-toastify';
import { shake } from '../../../Utils/animations';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otpBoxRef = useRef<HTMLDivElement>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwErrors, setPwErrors] = useState<{ newPassword?: string; confirmNewPassword?: string }>({});
  const pwFormRef = useRef<HTMLDivElement>(null);

  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail({
    onSuccess: () => {
      setStep('otp');
      toast.success('Email hợp lệ, mã OTP đã được gửi!');
    },
    onError: (err) => toast.error(`Email không hợp lệ: ${err.message || 'Vui lòng thử lại!'}`),
  });

  const { mutate: verifyOpt, isPending: isVerifyingOpt } = useVerifyOpt({
    onSuccess: () => {
      setStep('password');
      toast.success('Xác thực OTP thành công!');
    },
    onError: (err) => toast.error(`Xác thực OTP thất bại: ${err.message || 'Vui lòng thử lại!'}`),
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => onBackToLogin?.(), 1200);
    },
    onError: (err) => toast.error(`Đặt lại mật khẩu thất bại: ${err.message || 'Vui lòng thử lại!'}`),
  });

  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus();
  }, [step]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email!');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Email không hợp lệ!');
      return;
    }
    setEmailError('');
    verifyEmail(email);
  };

  const handleOtpChange = (index: number, raw: string) => {
    const value = raw.replace(/[^0-9]/g, '');
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = () => {
    if (otp.some((d) => d === '')) {
      if (otpBoxRef.current) shake(otpBoxRef.current);
      toast.error('Vui lòng nhập đầy đủ 6 số!');
      return;
    }
    verifyOpt({ email, otp: Number(otp.join('')) });
  };

  const handleResendCode = () => {
    if (!email) return;
    verifyEmail(email);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
    toast.success('Mã OTP đã được gửi lại!');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof pwErrors = {};
    if (!newPassword) next.newPassword = 'Vui lòng nhập mật khẩu mới!';
    else if (newPassword.length < 5 || newPassword.length > 20) next.newPassword = 'Phải từ 5-20 ký tự!';
    if (!confirmNewPassword) next.confirmNewPassword = 'Vui lòng xác nhận mật khẩu!';
    else if (confirmNewPassword !== newPassword) next.confirmNewPassword = 'Mật khẩu xác nhận không khớp!';
    setPwErrors(next);
    if (Object.keys(next).length > 0) {
      if (pwFormRef.current) shake(pwFormRef.current);
      return;
    }
    changePassword({ email, password: newPassword, newPassword });
  };

  if (step === 'email') {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'stone.900', mb: 0.5 }}>Quên mật khẩu</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Nhập email của bạn để nhận mã OTP khôi phục mật khẩu.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSendCode} noValidate>
          <TextField
            fullWidth
            label="Email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 3 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><MailRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
          />
          <Button type="submit" fullWidth size="large" variant="contained" color="secondary" loading={isVerifyingEmail} sx={{ mb: 3 }}>
            Gửi mã OTP
          </Button>
          <Divider />
          <Box sx={{ textAlign: 'center', pt: 3 }}>
            <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
              Đã nhớ mật khẩu?{' '}
              <Box component="span" onClick={onBackToLogin} sx={{ fontWeight: 700, color: 'stone.900', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Đăng nhập ngay
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (step === 'otp') {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'stone.900', mb: 0.5 }}>Nhập mã OTP</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            Mã OTP đã được gửi đến <Box component="span" sx={{ fontWeight: 700, color: 'stone.900' }}>{email}</Box>
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'stone.700', mb: 1.5 }}>Mã xác thực</Typography>
        <Box ref={otpBoxRef} sx={{ display: 'flex', gap: 1.25, justifyContent: 'center', mb: 4 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => { otpRefs.current[index] = el; }}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, padding: '14px 0' } } }}
              sx={{ width: { xs: 48, sm: 56 } }}
            />
          ))}
        </Box>

        <Button fullWidth size="large" variant="contained" color="secondary" onClick={handleVerifyOtp} loading={isVerifyingOpt} sx={{ mb: 3 }}>
          Xác nhận
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
            Không nhận được mã?{' '}
            <Box
              component="span"
              onClick={!isVerifyingEmail ? handleResendCode : undefined}
              sx={{ fontWeight: 700, color: isVerifyingEmail ? 'text.disabled' : 'stone.900', cursor: isVerifyingEmail ? 'not-allowed' : 'pointer', '&:hover': { textDecoration: isVerifyingEmail ? 'none' : 'underline' } }}
            >
              Gửi lại
            </Box>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); }}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: 'text.secondary', fontSize: '0.85rem', '&:hover': { color: 'stone.900' } }}
          >
            <ArrowBackRoundedIcon fontSize="small" /> Thay đổi email
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'stone.900', mb: 0.5 }}>Đặt lại mật khẩu</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>Nhập mật khẩu mới cho tài khoản của bạn.</Typography>
      </Box>
      <Box ref={pwFormRef} component="form" onSubmit={handleResetPassword} noValidate>
        <TextField
          fullWidth
          type={showPw ? 'text' : 'password'}
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!pwErrors.newPassword}
          helperText={pwErrors.newPassword}
          sx={{ mb: 2.5 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showConfirmPw ? 'text' : 'password'}
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={!!pwErrors.confirmNewPassword}
          helperText={pwErrors.confirmNewPassword}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowConfirmPw((s) => !s)}>
                  {showConfirmPw ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" fullWidth size="large" variant="contained" color="secondary" loading={isChangingPassword}>
          Đặt lại mật khẩu
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
