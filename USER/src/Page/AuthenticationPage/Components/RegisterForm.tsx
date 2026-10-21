import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Divider, Grid } from '@mui/material';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import dayjs from 'dayjs';
import { useRegister } from '../Hook/useRegister';
import type { IRegisterRequest } from '../../../Interface/Auth/IRegister';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { shake } from '../../../Utils/animations';

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  confirmPassword: string;
  userDob: string;
  phone: string;
  userAddress: string;
}

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const EMPTY: RegisterFormData = {
  email: '', firstName: '', lastName: '', userName: '', password: '',
  confirmPassword: '', userDob: '', phone: '', userAddress: '',
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const { mutate: register, isPending } = useRegister({
    onSuccess: () => {
      toast.success('Đăng ký tài khoản thành công!');
      setValues(EMPTY);
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(`Đăng ký thất bại: ${err.message || 'Vui lòng thử lại!'}`);
    },
  });

  const set = (key: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<RegisterFormData> = {};

    if (!values.email.trim()) next.email = 'Vui lòng nhập email!';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Email không hợp lệ!';

    if (!values.firstName.trim()) next.firstName = 'Vui lòng nhập họ!';
    else if (values.firstName.trim().length < 2 || values.firstName.trim().length > 20) next.firstName = 'Phải từ 2-20 ký tự!';

    if (!values.lastName.trim()) next.lastName = 'Vui lòng nhập tên!';
    else if (values.lastName.trim().length < 1 || values.lastName.trim().length > 20) next.lastName = 'Không được quá 20 ký tự!';

    if (!values.userName.trim()) next.userName = 'Vui lòng nhập tên đăng nhập!';
    else if (values.userName.length < 3 || values.userName.length > 20) next.userName = 'Phải từ 3-20 ký tự!';
    else if (!/^[a-zA-Z0-9_]+$/.test(values.userName)) next.userName = 'Chỉ chứa chữ, số và dấu gạch dưới!';

    if (!values.password) next.password = 'Vui lòng nhập mật khẩu!';
    else if (values.password.length < 5 || values.password.length > 20) next.password = 'Phải từ 5-20 ký tự!';

    if (!values.confirmPassword) next.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    else if (values.confirmPassword !== values.password) next.confirmPassword = 'Mật khẩu xác nhận không khớp!';

    if (!values.userDob) next.userDob = 'Vui lòng chọn ngày sinh!';

    if (!values.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại!';
    else if (!/^\d{10}$/.test(values.phone)) next.phone = 'Số điện thoại phải có đúng 10 chữ số!';

    if (!values.userAddress.trim()) next.userAddress = 'Vui lòng nhập địa chỉ!';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (formRef.current) shake(formRef.current);
      return;
    }

    const { confirmPassword, ...rest } = values;
    void confirmPassword;
    const payload: IRegisterRequest = { ...rest, userDob: dayjs(values.userDob).format('YYYY-MM-DD') };
    register(payload);
  };

  return (
    <Box ref={formRef}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontSize: '1.5rem', color: 'stone.900', mb: 0.5 }}>
          Đăng ký tài khoản
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          Tạo tài khoản mới để bắt đầu mua sắm cùng chúng tôi.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Email"
              placeholder="example@email.com"
              value={values.email}
              onChange={set('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{ startAdornment: <InputAdornment position="start"><MailRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Họ"
              placeholder="Nguyễn"
              value={values.firstName}
              onChange={set('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tên"
              placeholder="Văn A"
              value={values.lastName}
              onChange={set('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              placeholder="username123"
              value={values.userName}
              onChange={set('userName')}
              error={!!errors.userName}
              helperText={errors.userName}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={values.password}
              onChange={set('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type={showConfirm ? 'text' : 'password'}
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={values.confirmPassword}
              onChange={set('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm((s) => !s)}>
                      {showConfirm ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Ngày sinh"
              value={values.userDob}
              onChange={set('userDob')}
              error={!!errors.userDob}
              helperText={errors.userDob}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Số điện thoại"
              placeholder="912345678"
              value={values.phone}
              onChange={set('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              slotProps={{ htmlInput: { maxLength: 10 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneRoundedIcon sx={{ color: 'stone.400' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Địa chỉ"
              placeholder="Nhập địa chỉ của bạn"
              value={values.userAddress}
              onChange={set('userAddress')}
              error={!!errors.userAddress}
              helperText={errors.userAddress}
            />
          </Grid>
        </Grid>

        <Button type="submit" fullWidth size="large" variant="contained" color="secondary" loading={isPending} sx={{ mt: 3, mb: 3 }}>
          Đăng ký tài khoản
        </Button>

        <Divider />

        <Box sx={{ textAlign: 'center', pt: 3 }}>
          <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
            Đã có tài khoản?{' '}
            <Box
              component="span"
              onClick={onSwitchToLogin}
              sx={{ fontWeight: 700, color: 'stone.900', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Đăng nhập ngay
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;
