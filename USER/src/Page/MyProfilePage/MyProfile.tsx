import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Avatar, Button, Chip, Divider, CircularProgress, Alert, Box } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import InfoItem from './Components/InfoItem';
import EditProfileModal from './Components/EditProfileModal';
import { useGetUserDetail } from './Hook/useGetMyProfile';
import type { IGetMyProfileResponse } from '../../Interface/Users/IGetMyProfile';
import { getUserStatusText } from '../../Utils/utils';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const quickLinks = [
  { label: 'Đơn hàng của tôi', to: '/order-history', icon: ReceiptLongRoundedIcon },
  { label: 'Giỏ hàng', to: '/cart', icon: ShoppingCartRoundedIcon },
  { label: 'Thông báo', to: '/notifications', icon: NotificationsRoundedIcon },
  { label: 'Tiếp tục mua sắm', to: '/products', icon: StorefrontRoundedIcon },
];

const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const id = useAuthStore.getState().id ?? undefined;

  const { data, isLoading, error } = useGetUserDetail(id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getAvatarSrc = (userProfile?: IGetMyProfileResponse) => userProfile?.userImg || undefined;

  if (isLoading) {
    return (
      <Box className="min-h-screen bg-stone-50 flex items-center justify-center">
        <CircularProgress size={40} sx={{ color: 'stone.900' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Alert severity="error">
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </Alert>
        </div>
      </div>
    );
  }

  const userProfile = data?.data;

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">Không tìm thấy thông tin hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero / cover */}
      <div className="bg-stone-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <Avatar
                src={getAvatarSrc(userProfile)}
                sx={{ width: 104, height: 104, border: '3px solid white' }}
              >
                <PersonRoundedIcon sx={{ fontSize: 54 }} />
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-white hover:bg-stone-100 text-stone-900 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110">
                <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-stone-400 text-sm mb-3">@{userProfile.userName}</p>
              <Chip
                label={getUserStatusText(userProfile.status)}
                size="small"
                sx={{
                  bgcolor: userProfile.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                  color: userProfile.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                  fontWeight: 600,
                }}
              />
            </div>

            <Button
              variant="contained"
              startIcon={<EditRoundedIcon />}
              onClick={handleEdit}
              sx={{ bgcolor: 'white', color: 'stone.900', flexShrink: 0, '&:hover': { bgcolor: 'stone.100' } }}
            >
              Chỉnh sửa thông tin
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:-mt-6 pb-10">
        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center justify-center gap-2 bg-white border border-stone-200 rounded-lg py-5 px-2 text-center shadow-sm transition-all duration-200 hover:border-stone-900 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon sx={{ fontSize: 24, color: '#1c1917' }} />
              <span className="text-xs font-semibold text-stone-700">{label}</span>
            </Link>
          ))}
        </div>

        <Card variant="outlined" className="shadow-sm">
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <BadgeRoundedIcon className="text-xl" sx={{ color: 'stone.600' }} />
                <span className="text-lg font-semibold text-stone-900">Thông tin chi tiết</span>
              </div>
            }
            action={
              <Button
                size="small"
                variant="text"
                color="secondary"
                endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={handleEdit}
                className="hidden sm:inline-flex"
              >
                Chỉnh sửa
              </Button>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              <InfoItem
                icon={<PersonRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Họ"
                value={userProfile.firstName}
              />

              <InfoItem
                icon={<PersonRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Tên"
                value={userProfile.lastName}
              />

              <InfoItem
                icon={<MailRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Email"
                value={userProfile.email}
              />

              <InfoItem
                icon={<PhoneRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Số điện thoại"
                value={userProfile.phone}
              />

              <InfoItem
                icon={<CalendarMonthRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Ngày sinh"
                value={dayjs(userProfile.userDob).format('DD/MM/YYYY')}
              />

              <InfoItem
                icon={<HomeRoundedIcon className="text-lg" sx={{ color: 'stone.500' }} />}
                label="Địa chỉ"
                value={userProfile.userAddress}
                fullWidth
              />
            </div>
            <Divider className="my-6" />
            {/* Additional Info Section */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-stone-900 mb-4 uppercase tracking-wide">Thông tin tài khoản</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-stone-500 mb-1">Ngày tạo tài khoản</p>
                  <p className="text-sm font-medium text-stone-900">
                    {dayjs(userProfile.createAt).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-1">Lần cập nhật cuối</p>
                  <p className="text-sm font-medium text-stone-900">
                    {dayjs(userProfile.updateAt).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Edit Profile Modal - Truyền userProfile và callbacks */}
      {isEditing && <EditProfileModal open={isEditing} userData={userProfile} onCancel={handleCancel} />}
    </div>
  );
};

export default MyProfile;
