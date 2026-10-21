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
import dayjs from 'dayjs';
import InfoItem from './Components/InfoItem';
import EditProfileModal from './Components/EditProfileModal';
import { useGetUserDetail } from './Hook/useGetMyProfile';
import type { IGetMyProfileResponse } from '../../Interface/Users/IGetMyProfile';
import { getUserStatusText } from '../../Utils/utils';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

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
      <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy thông tin hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ của tôi</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-1">
            <Card variant="outlined" className="shadow-sm border-0">
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  {/* Avatar Section */}
                  <div className="relative mb-6">
                    <Avatar
                      src={getAvatarSrc(userProfile)}
                      className="border-4 border-white shadow-xl"
                      sx={{ width: 180, height: 180 }}
                    >
                      <PersonRoundedIcon sx={{ fontSize: 90 }} />
                    </Avatar>
                    <button className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110">
                      <CameraAltRoundedIcon className="text-xl" />
                    </button>
                  </div>
                  {/* Name & Username */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  <p className="text-gray-500 text-lg mb-4">@{userProfile.userName}</p>
                  {/* Status Badge */}
                  <Chip
                    label={getUserStatusText(userProfile.status)}
                    color={userProfile.status === 'ACTIVE' ? 'success' : 'error'}
                    className="text-sm px-2 mb-6"
                  />
                  {/* Edit Button */}
                  <Button
                    variant="contained"
                    startIcon={<EditRoundedIcon />}
                    onClick={handleEdit}
                    size="large"
                    fullWidth
                    className="h-12"
                  >
                    Chỉnh sửa thông tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Card variant="outlined" className="shadow-sm border-0">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <BadgeRoundedIcon className="text-xl text-blue-500" />
                    <span className="text-xl font-semibold">Thông tin chi tiết</span>
                  </div>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  <InfoItem
                    icon={<PersonRoundedIcon className="text-lg text-blue-500" />}
                    label="Họ"
                    value={userProfile.firstName}
                  />

                  <InfoItem
                    icon={<PersonRoundedIcon className="text-lg text-blue-500" />}
                    label="Tên"
                    value={userProfile.lastName}
                  />

                  <InfoItem
                    icon={<MailRoundedIcon className="text-lg text-green-500" />}
                    label="Email"
                    value={userProfile.email}
                  />

                  <InfoItem
                    icon={<PhoneRoundedIcon className="text-lg text-orange-500" />}
                    label="Số điện thoại"
                    value={userProfile.phone}
                  />

                  <InfoItem
                    icon={<CalendarMonthRoundedIcon className="text-lg text-purple-500" />}
                    label="Ngày sinh"
                    value={dayjs(userProfile.userDob).format('DD/MM/YYYY')}
                  />

                  <InfoItem
                    icon={<HomeRoundedIcon className="text-lg text-red-500" />}
                    label="Địa chỉ"
                    value={userProfile.userAddress}
                    fullWidth
                  />
                </div>
                <Divider className="my-6" />
                {/* Additional Info Section */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày tạo tài khoản</p>
                      <p className="text-base font-medium text-gray-900">
                        {dayjs(userProfile.createAt).format('DD/MM/YYYY')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lần cập nhật cuối</p>
                      <p className="text-base font-medium text-gray-900">
                        {dayjs(userProfile.updateAt).format('DD/MM/YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Edit Profile Modal - Truyền userProfile và callbacks */}
        {isEditing && <EditProfileModal open={isEditing} userData={userProfile} onCancel={handleCancel} />}
      </div>
    </div>
  );
};

export default MyProfile;
