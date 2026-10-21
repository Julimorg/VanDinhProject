import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import dayjs from 'dayjs';
import { useUploadImgFile } from '../../../Hook/useUploadImgFile';
import { useUpdateMyProfile } from '../Hook/useUpdateUser';
import { toast } from 'react-toastify';
import type { IUdpateMyProfileRequest } from '../../../Interface/Users/IUpdateMyProfile';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userImg?: string;
  phone: string;
  userAddress: string;
  userDob: string;
  status: string;
}

interface EditProfileModalProps {
  open: boolean;
  userData: UserData;
  onCancel: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, userData, onCancel }) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    userAddress: '',
    userDob: '',
  });

  const { previewUrl, handleFileChange, getCurrentFile, reset } = useUploadImgFile({
    onFileChange: () => toast.success('File ảnh đã được chọn!'),
  });

  const { mutate: updateProfile, isPending } = useUpdateMyProfile(userData.id, {
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!');
      reset();
      onCancel();
    },
    onError: (error) => {
      toast.error(`Lỗi cập nhật: ${error.message || 'Vui lòng thử lại!'}`);
    },
  });

  useEffect(() => {
    if (open) {
      setValues({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        phone: userData.phone,
        userAddress: userData.userAddress,
        userDob: dayjs(userData.userDob).format('YYYY-MM-DD'),
      });
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userData]);

  const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    if (!values.firstName.trim()) return toast.error('Vui lòng nhập họ!');
    if (!values.lastName.trim()) return toast.error('Vui lòng nhập tên!');
    if (!values.userName.trim()) return toast.error('Vui lòng nhập tên người dùng!');
    if (!EMAIL_REGEX.test(values.email)) return toast.error('Vui lòng nhập email hợp lệ!');
    if (!values.phone.trim()) return toast.error('Vui lòng nhập số điện thoại!');
    if (!values.userAddress.trim()) return toast.error('Vui lòng nhập địa chỉ!');
    if (!values.userDob) return toast.error('Vui lòng chọn ngày sinh!');

    const requestBody: IUdpateMyProfileRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      email: values.email,
      phone: values.phone,
      userAddress: values.userAddress,
      userDob: values.userDob,
      userImg: getCurrentFile() ?? undefined,
    };

    updateProfile(requestBody);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth disableEscapeKeyDown={isPending}>
      <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
      <DialogContent sx={{ opacity: isPending ? 0.6 : 1, pointerEvents: isPending ? 'none' : 'auto' }}>
        <Stack spacing={2.5} className="mt-1">
          <div>
            <Typography variant="caption" color="text.secondary" className="block mb-1">
              Ảnh đại diện (JPG, PNG, max 2MB)
            </Typography>
            <Button component="label" variant="outlined" size="small" startIcon={<FileUploadRoundedIcon />} disabled={isPending}>
              Chọn ảnh
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={handleFileChange}
              />
            </Button>
            {previewUrl && getCurrentFile() && (
              <div className="mt-2 flex items-center gap-2">
                <img src={previewUrl} alt="Avatar preview" className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200" />
                <span className="text-xs text-gray-600">Preview: {getCurrentFile()?.name}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Họ" value={values.firstName} onChange={handleChange('firstName')} disabled={isPending} fullWidth required />
            <TextField label="Tên" value={values.lastName} onChange={handleChange('lastName')} disabled={isPending} fullWidth required />
          </div>

          <TextField label="Tên người dùng" value={values.userName} onChange={handleChange('userName')} disabled={isPending} fullWidth required />
          <TextField label="Email" type="email" value={values.email} onChange={handleChange('email')} disabled={isPending} fullWidth required />
          <TextField label="Số điện thoại" value={values.phone} onChange={handleChange('phone')} disabled={isPending} fullWidth required />
          <TextField
            label="Địa chỉ"
            value={values.userAddress}
            onChange={handleChange('userAddress')}
            disabled={isPending}
            fullWidth
            multiline
            rows={3}
            required
          />
          <TextField
            label="Ngày sinh"
            type="date"
            value={values.userDob}
            onChange={handleChange('userDob')}
            disabled={isPending}
            fullWidth
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleCancel} disabled={isPending}>
          Hủy
        </Button>
        <Button variant="contained" size="large" onClick={handleSave} loading={isPending} disabled={isPending}>
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
