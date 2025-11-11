import React, { useState } from 'react';
import { Card, Avatar, Button, Tag, Divider } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, CameraOutlined, IdcardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InfoItem from './Components/InfoItem';
import EditProfileModal from './Components/EditProfileModal';


interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userImg?: string; // URL ảnh
  phone: string;
  userAddress: string;
  userDob: string; // YYYY-MM-DD
  status: string;
}

const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
 
  // Sample user data
  const [userData, setUserData] = useState<UserData>({
    id: "USR001",
    firstName: "Nguyen",
    lastName: "Van A",
    userName: "nguyenvana",
    email: "nguyenvana@email.com",
    userImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    phone: "0123456789",
    userAddress: "123 Nguyen Hue, Quan 1, TP.HCM",
    userDob: "1990-01-15",
    status: "Active"
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Hàm lấy src cho Avatar
  const getAvatarSrc = () => userData.userImg || undefined;

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
            <Card className="shadow-sm border-0">
              <div className="flex flex-col items-center text-center">
                {/* Avatar Section */}
                <div className="relative mb-6">
                  <Avatar
                    size={180}
                    src={getAvatarSrc()}
                    icon={<UserOutlined />}
                    className="border-4 border-white shadow-xl"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110">
                    <CameraOutlined className="text-xl" />
                  </button>
                </div>
                {/* Name & Username */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-500 text-lg mb-4">@{userData.userName}</p>
                {/* Status Badge */}
                <Tag
                  color={userData.status === 'Active' ? 'green' : 'red'}
                  className="text-sm px-6 py-2 mb-6"
                >
                  {userData.status}
                </Tag>
                {/* User ID */}
                <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-500 mb-1">Mã người dùng</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">{userData.id}</p>
                </div>
                {/* Edit Button */}
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="large"
                  block
                  className="h-12"
                >
                  Chỉnh sửa thông tin
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Card
              className="shadow-sm border-0"
              title={
                <div className="flex items-center gap-2">
                  <IdcardOutlined className="text-xl text-blue-500" />
                  <span className="text-xl font-semibold">Thông tin chi tiết</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <InfoItem
                  icon={<UserOutlined className="text-lg text-blue-500" />}
                  label="Họ"
                  value={userData.firstName}
                />
               
                <InfoItem
                  icon={<UserOutlined className="text-lg text-blue-500" />}
                  label="Tên"
                  value={userData.lastName}
                />
               
                <InfoItem
                  icon={<MailOutlined className="text-lg text-green-500" />}
                  label="Email"
                  value={userData.email}
                />
               
                <InfoItem
                  icon={<PhoneOutlined className="text-lg text-orange-500" />}
                  label="Số điện thoại"
                  value={userData.phone}
                />
               
                <InfoItem
                  icon={<CalendarOutlined className="text-lg text-purple-500" />}
                  label="Ngày sinh"
                  value={dayjs(userData.userDob).format('DD/MM/YYYY')}
                />
               
                <InfoItem
                  icon={<HomeOutlined className="text-lg text-red-500" />}
                  label="Địa chỉ"
                  value={userData.userAddress}
                  fullWidth
                />
              </div>

              <Divider className="my-6" />
              {/* Additional Info Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin tài khoản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngày tạo tài khoản</p>
                    <p className="text-base font-medium text-gray-900">15/01/2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lần cập nhật cuối</p>
                    <p className="text-base font-medium text-gray-900">10/11/2024</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal - Truyền userData và callbacks */}
        <EditProfileModal
          open={isEditing}
          userData={userData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default MyProfile;