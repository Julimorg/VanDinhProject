import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { useLogOut } from '../Hook/useLogOut';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../Middleware/useAuthStoreWithLocal';

interface UserProfileDropdownProps {
  userName: string;
  email: string;
  userImg: string;
  navigate: (path: string) => void;
  isMobile: boolean;
}

const getAvatarSrc = (img: string) => (img && img !== 'unknown' && img.startsWith('http') ? img : undefined);

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  userName,
  email,
  userImg,
  navigate,
  isMobile,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigateHook = useNavigate();
  const navigateTo = navigate || navigateHook;
  const { accessToken: token, clearTokens } = useAuthStore();
  const open = Boolean(anchorEl);

  const { mutate: logOut, isPending } = useLogOut({
    onSuccess: () => {
      clearTokens();
      toast.success('Đăng xuất thành công!');
      setAnchorEl(null);
      navigateTo('/login');
    },
    onError: (error) => {
      toast.error(`Lỗi đăng xuất: ${error || 'Vui lòng thử lại!'}`);
      clearTokens();
      setAnchorEl(null);
      navigateTo('/login');
    },
  });

  const handleLogout = () => {
    if (!token) {
      toast.warning('Không tìm thấy token, đang chuyển hướng...');
      setAnchorEl(null);
      navigateTo('/login');
      return;
    }
    logOut({ token });
  };

  const handleGo = (path: string) => {
    setAnchorEl(null);
    navigateTo(path);
  };

  return (
    <>
      <Box
        onClick={(e) => !isPending && setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: isMobile ? 0.5 : 1.25,
          py: 0.75,
          borderRadius: 2,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          '&:hover': { bgcolor: 'stone.100' },
        }}
      >
        <Avatar src={getAvatarSrc(userImg)} sx={{ width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, bgcolor: 'stone.900' }}>
          <PersonRoundedIcon fontSize="small" />
        </Avatar>
        {!isMobile && (
          <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.84rem', fontWeight: 700, color: 'stone.900', lineHeight: 1.2 }} noWrap>
              {userName}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }} noWrap>
              {email}
            </Typography>
          </Box>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 260, mt: 1, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={getAvatarSrc(userImg)} sx={{ width: 40, height: 40, bgcolor: 'stone.900' }}>
            <PersonRoundedIcon fontSize="small" />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'stone.900' }} noWrap>
              {userName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }} noWrap>
              {email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleGo('/profile')} sx={{ py: 1.25 }}>
          <ListItemIcon><PersonRoundedIcon fontSize="small" sx={{ color: 'stone.600' }} /></ListItemIcon>
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={() => handleGo('/order-history')} sx={{ py: 1.25 }}>
          <ListItemIcon><ShoppingBagRoundedIcon fontSize="small" sx={{ color: 'stone.600' }} /></ListItemIcon>
          Đơn hàng của tôi
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} disabled={isPending} sx={{ py: 1.25, color: 'error.main' }}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
          {isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfileDropdown;
