import React from 'react';
import { Avatar, Dropdown, type MenuProps } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  SettingOutlined, 
  LockOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';

interface UserProfileDropdownProps {
  userName: string;
  navigate: (path: string) => void;
  handleLogout: () => void;
  isMobile: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  userName,
  navigate,
  handleLogout,
  isMobile,
}) => {
  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar size={40} icon={<UserOutlined />} className="bg-gray-900" />
            <div>
              <div className="font-semibold text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
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
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined className="text-gray-600" />,
      label: 'Đơn hàng của tôi',
      onClick: () => {
        console.log('Nav to order-history'); // Debug để check click
        navigate('/order-history');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-gray-600" />,
      label: 'Cài đặt',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined className="text-gray-600" />,
      label: 'Đổi mật khẩu',
      onClick: () => navigate('/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-600" />,
      label: <span className="text-red-600">Đăng xuất</span>,
      onClick: handleLogout,
    },
  ];

  const dropdownWidth = isMobile ? 'w-[calc(100vw-2rem)] max-w-[280px]' : 'min-w-[260px]';
  const avatarSize = isMobile ? 32 : 36;
  const padding = isMobile ? 'p-2' : 'px-3 py-2';

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="user-dropdown"
      dropdownRender={(menu) => (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${dropdownWidth}`}>
          {menu}
        </div>
      )}
    >
      <div className={`flex items-center gap-2 ${padding} hover:bg-gray-100 rounded-lg cursor-pointer transition-colors`}>
        <Avatar 
          size={avatarSize} 
          icon={<UserOutlined />} 
          className="bg-gray-900 flex-shrink-0" 
        />
        {!isMobile && (
          <div className="hidden lg:block">
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {userName}
            </div>
            <div className="text-xs text-gray-500">
              Quản trị viên
            </div>
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default UserProfileDropdown;