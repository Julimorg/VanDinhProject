import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Input, List, type MenuProps } from 'antd';
import {
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { cutStringOnThirdChar } from '@/Utils/ulti';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  isMobile: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMobile, setDrawerVisible }) => {
  const { userName, email, userImg } = useAuthStore();

  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleViewProfile = () => {
    console.log('View profile clicked');
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
      icon: <LogoutOutlined />,
      label: 'Đăng Xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Đơn hàng mới',
      description: 'Đơn hàng #ORD-005 từ khách hàng Nguyễn Văn B',
      time: '2 phút trước',
      color: '#1890ff',
    },
    {
      id: 2,
      title: 'Đơn hàng đã giao',
      description: 'Đơn hàng #ORD-003 đã được giao thành công',
      time: '15 phút trước',
      color: '#52c41a',
    },
    {
      id: 3,
      title: 'Sản phẩm sắp hết',
      description: 'Sơn Dulux 5L chỉ còn 5 sản phẩm trong kho',
      time: '1 giờ trước',
      color: '#fa8c16',
    },
    {
      id: 4,
      title: 'Đánh giá mới',
      description: 'Khách hàng Trần Thị C đã đánh giá 5 sao',
      time: '3 giờ trước',
      color: '#722ed1',
    },
    {
      id: 5,
      title: 'Đơn hàng bị hủy',
      description: 'Đơn hàng #ORD-001 đã bị khách hàng hủy',
      time: '5 giờ trước',
      color: '#ff4d4f',
    },
  ];

  const notificationMenu = (
    <div
      className={`${
        isMobile ? 'w-80' : 'w-96'
      } max-h-[450px] overflow-auto bg-white rounded-lg shadow-2xl`}
    >
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-base font-semibold">Thông báo</span>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <div className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex gap-3">
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ background: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: item.color }}>
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600 m-0">{item.description}</p>
              </div>
            </div>
          </div>
        )}
      />
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );

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

        {/* Notification */}
        <Dropdown
          dropdownRender={() => notificationMenu}
          placement="bottomRight"
          trigger={['click']}
          overlayStyle={{ paddingTop: 8 }}
        >
          <div className="relative cursor-pointer">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <BellOutlined className="text-xl text-gray-600" />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              5
            </span>
          </div>
        </Dropdown>

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