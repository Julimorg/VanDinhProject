import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Divider } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useNavigate } from 'react-router-dom';
import type { ILoginRequest } from '../../../Interface/Auth/ILogin';
import { useLogin } from '../Hook/useLogin';
import { useCartStore } from '../../../Middleware/useCartStore';
import { toast } from 'react-toastify';
import { shake } from '../../../Utils/animations';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToForgot }) => {
  const navigate = useNavigate();
  const { mutate: loginMutate, isPending } = useLogin();
  const setCartCount = useCartStore((state) => state.setCartCount);

  const [values, setValues] = useState<ILoginRequest>({ username: '', password: '' });
  const [errors, setErrors] = useState<Partial<ILoginRequest>>({});
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const validate = (): boolean => {
    const next: Partial<ILoginRequest> = {};
    if (!values.username.trim()) next.username = 'Vui lòng nhập tên đăng nhập!';
    else if (values.username.trim().length < 3) next.username = 'Tên đăng nhập phải có ít nhất 3 ký tự!';
    if (!values.password) next.password = 'Vui lòng nhập mật khẩu!';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (formRef.current) shake(formRef.current);
      return;
    }

    loginMutate(values, {
      onSuccess: () => {
        useCartStore.persist.clearStorage();
        setCartCount(0);
        toast.success('Đăng nhập thành công!');
        navigate('/dashboard');
      },
      onError: () => {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
      },
    });
  };

  return (
    <Box ref={formRef}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'stone.900', mb: 0.5 }}>
          Đăng nhập
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập của bạn"
          value={values.username}
          onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
          error={!!errors.username}
          helperText={errors.username}
          autoComplete="off"
          sx={{ mb: 2.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon sx={{ color: 'stone.400' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon sx={{ color: 'stone.400' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                  {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
          <Typography
            onClick={onSwitchToForgot}
            sx={{ fontSize: '0.85rem', color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'stone.900', textDecoration: 'underline' } }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button type="submit" fullWidth size="large" variant="contained" color="secondary" loading={isPending} sx={{ mb: 3 }}>
          Đăng nhập
        </Button>

        <Divider />

        <Box sx={{ textAlign: 'center', pt: 3 }}>
          <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
            Chưa có tài khoản?{' '}
            <Box
              component="span"
              onClick={onSwitchToRegister}
              sx={{ fontWeight: 700, color: 'stone.900', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Đăng ký ngay
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
