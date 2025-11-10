import React, { useState } from 'react';
import { Card, Avatar, Button, Tag, Descriptions } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, CameraOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import EditProfileModal from './Components/EditProfileModal';


const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
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

  const [editForm, setEditForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    userName: userData.userName,
    email: userData.email,
    phone: userData.phone,
    userAddress: userData.userAddress,
    userDob: dayjs(userData.userDob)
  });

  const handleEdit = () => {
    setEditForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
      phone: userData.phone,
      userAddress: userData.userAddress,
      userDob: dayjs(userData.userDob)
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.firstName || !editForm.lastName || !editForm.userName || 
        !editForm.email || !editForm.phone || !editForm.userAddress || !editForm.userDob) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    setUserData({
      ...userData,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      userName: editForm.userName,
      email: editForm.email,
      phone: editForm.phone,
      userAddress: editForm.userAddress,
      userDob: editForm.userDob.format('YYYY-MM-DD')
    });
    message.success('Cập nhật thông tin thành công!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar 
                size={{ xs: 100, sm: 120, md: 140, lg: 160 }}
                src={userData.userImg}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
                <CameraOutlined className="text-gray-600 text-lg" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-gray-500 text-base md:text-lg">@{userData.userName}</p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <Tag color={userData.status === 'Active' ? 'green' : 'red'} className="text-sm px-4 py-1">
                    {userData.status}
                  </Tag>
                </div>
              </div>
              
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
                className="w-full md:w-auto"
                size="large"
              >
                Chỉnh sửa thông tin
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Details Card */}
        <Card 
          title={<span className="text-lg font-semibold">Thông tin chi tiết</span>}
          className="shadow-sm"
        >
          <Descriptions 
            column={{ xs: 1, sm: 1, md: 2 }}
            labelStyle={{ fontWeight: 600, color: '#595959' }}
            contentStyle={{ color: '#262626' }}
          >
            <Descriptions.Item 
              label={<span><UserOutlined className="mr-2" />Họ</span>}
            >
              {userData.firstName}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><UserOutlined className="mr-2" />Tên</span>}
            >
              {userData.lastName}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><UserOutlined className="mr-2" />Tên người dùng</span>}
            >
              {userData.userName}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><MailOutlined className="mr-2" />Email</span>}
            >
              {userData.email}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><PhoneOutlined className="mr-2" />Số điện thoại</span>}
            >
              {userData.phone}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><CalendarOutlined className="mr-2" />Ngày sinh</span>}
            >
              {dayjs(userData.userDob).format('DD/MM/YYYY')}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<span><HomeOutlined className="mr-2" />Địa chỉ</span>}
              span={2}
            >
              {userData.userAddress}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Sử dụng component Modal riêng */}
        <EditProfileModal
          open={isEditing}
          editForm={editForm}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleFormChange}
        />
      </div>
    </div>
  );
};

export default MyProfile;