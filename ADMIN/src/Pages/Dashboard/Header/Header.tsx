import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Input, type MenuProps } from 'antd';
import {
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { cutStringOnThirdChar } from '@/Utils/ulti';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './Component/Notification';
import { useLogOut } from './Hook/useLogOut';
import { IApiResponse } from '@/Interface/IApiResponse';
import { toast } from 'react-toastify';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  isMobile: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, setDrawerVisible }) => {

  const navigate = useNavigate(); 
  
  const { userName, email, userImg, accessToken, clearTokens} = useAuthStore();

  const [searchValue, setSearchValue] = useState('');

  const { mutate: logOut, isPending, error } = useLogOut({
    onSuccess: (response: IApiResponse<void>) => {

      console.log('Logout message:', response.message);
      
      if (response.message) {
        toast.success(response.message); 
      }
    
      clearTokens();
      navigate('/login');
    },
    onError: (err) => {
      console.error('Logout lỗi:', err);
      toast.error('Đăng xuất thất bại, vui lòng thử lại.');
    },
  });

  const handleLogout = () => {
    if (accessToken) {
      logOut({ accessToken }); 
    }
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Xem Profile',
      onClick: handleViewProfile,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: isPending ? <LoadingOutlined spin /> : <LogoutOutlined />, 
      label: isPending ? 'Đang đăng xuất...' : 'Đăng Xuất', 
      onClick: handleLogout,
      danger: true,
      disabled: isPending,
    },
  ];

  return (
    <AntHeader className="px-6 bg-white flex items-center justify-between border-b border-gray-100 h-16 sticky top-0 z-[998]">
      <div className="flex items-center gap-6">
        {isMobile && (
          <button
            onClick={() => setDrawerVisible(true)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MenuOutlined className="text-lg" />
          </button>
        )}
        <h3 className="text-2xl font-bold text-gray-800 m-0">Tổng Quan</h3>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:block">
          <Input
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-72 rounded-full border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:shadow-blue-100"
            size="large"
            allowClear
          />
        </div>

        <NotificationDropdown isMobile={isMobile} />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 m-0">{userName}</p>
              <p className="text-xs text-gray-500 m-0">{email}</p>
            </div>
            {userImg ? (
              <Avatar size="large" className="bg-blue-700 flex-shrink-0" src={userImg} alt={userName ?? ''} />
            ) : (
              <Avatar size="large" className="bg-blue-700 flex-shrink-0">
                {cutStringOnThirdChar(userName ?? '')}
              </Avatar>
            )}
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;