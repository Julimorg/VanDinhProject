import React, { useState } from 'react';
import { Avatar, Dropdown, type MenuProps, message } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LockOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogOut } from '../Hook/useLogOut';
import { toast } from 'react-toastify';
import { useAuthStoreCookiesStorage } from '../../../Middleware/useAuthStore';

interface UserProfileDropdownProps {
  userName: string;
  email: string;
  userImg: string;
  navigate: (path: string) => void;
  isMobile: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  userName,
  email,
  userImg,
  navigate,
  isMobile,
}) => {
  const [open, setOpen] = useState(false);
  const navigateHook = useNavigate();
  const navigateTo = navigate || navigateHook;
  const { accessToken, clearTokens } = useAuthStoreCookiesStorage();

  const { mutate: logOut, isPending } = useLogOut({
    onSuccess: () => {
      clearTokens();
      toast.success('Đăng xuất thành công!');
      setOpen(false);
      navigateTo('/login');
    },
    onError: (error) => {
      message.error(`Lỗi đăng xuất: ${error || 'Vui lòng thử lại!'}`);
      clearTokens();
      setOpen(false);
      navigateTo('/login');
    },
  });

  const handleLogout = () => {
    if (!accessToken) {
      message.warning('Không tìm thấy token, đang chuyển hướng...');
      setOpen(false);
      navigateTo('/login');
      return;
    }
    logOut({ accessToken });
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'profile':
        navigateTo('/profile');
        break;
      case 'orders':
        navigateTo('/order-history');
        break;
      case 'settings':
        navigateTo('/settings');
        break;
      case 'change-password':
        navigateTo('/change-password');
        break;
      case 'logout':
        handleLogout();
        return;
    }
    setOpen(false);
  };

  const handleOpenChange = (visible: boolean) => {
    if (!isPending) {
      setOpen(visible);
    }
  };

  // Hàm lấy src cho Avatar: ưu tiên userImg nếu hợp lệ, fallback icon
  const getAvatarSrc = (img: string) => {
    return img && img !== 'unknown' && img.startsWith('http') ? img : undefined;
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar 
              size={40} 
              src={getAvatarSrc(userImg)} 
              icon={<UserOutlined />} 
              className="bg-gray-900" 
            />
            <div>
              <div className="font-semibold text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined className="text-gray-600" />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined className="text-gray-600" />,
      label: 'Đơn hàng của tôi',
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-gray-600" />,
      label: 'Cài đặt',
    },
    {
      key: 'change-password',
      icon: <LockOutlined className="text-gray-600" />,
      label: 'Đổi mật khẩu',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className={`text-red-600 ${isPending ? 'opacity-50' : ''}`} />,
      label: (
        <span className={`text-red-600 ${isPending ? 'opacity-50' : ''}`}>
          {isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </span>
      ),
      disabled: isPending,
    },
  ];

  const dropdownWidth = isMobile ? 'w-[calc(100vw-2rem)] max-w-[280px]' : 'min-w-[260px]';
  const avatarSize = isMobile ? 32 : 36;
  const padding = isMobile ? 'p-2' : 'px-3 py-2';

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      menu={{
        items: userMenuItems,
        onClick: ({ key }) => handleMenuClick(key),
        selectable: false,
      }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="user-dropdown"
      dropdownRender={(menu) => (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${dropdownWidth}`}>
          {menu}
        </div>
      )}
    >
      <div
        className={`flex items-center gap-2 ${padding} hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
          isPending ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        <Avatar 
          size={avatarSize} 
          src={getAvatarSrc(userImg)} 
          icon={<UserOutlined />} 
          className="bg-gray-900 flex-shrink-0" 
        />
        {!isMobile && (
          <div className="hidden lg:block">
            <div className="text-sm font-semibold text-gray-900 leading-tight">{userName}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default UserProfileDropdown;