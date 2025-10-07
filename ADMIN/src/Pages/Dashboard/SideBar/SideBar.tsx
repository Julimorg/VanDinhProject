import React, { useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  ProductOutlined,
  ShopOutlined,
  BgColorsOutlined,
  KeyOutlined,
  DotChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import CategoryList from '@/Pages/CategoryManagement/CategoryManagementPage';

const { Sider } = Layout;

type CustomMenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  path?: string;
  children?: CustomMenuItem[];
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  drawerVisible: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, isMobile, drawerVisible, setDrawerVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  const [selectedKey, setSelectedKey] = useState(currentPath);

  const menuItems: CustomMenuItem[] = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Tổng Quan',
      path: '/dashboard'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản Lý User',
      path: '/users'
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Quản Lý Đơn Hàng',
      path: '/orders'
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Quản Lý Sản Phẩm',
      path: '/products'
    },
    {
      key: 'supplier',
      icon: <ShopOutlined />,
      label: 'Quản Lý Nhà Cung Cấp',
      path: '/suppliers'
    },
    {
      key: 'color',
      icon: <BgColorsOutlined />,
      label: 'Quản lý mã màu',
      path: '/colors'
    },
    {
      key: 'category',
      icon: <KeyOutlined />,
      label: 'Quản lý Vật Dụng',
      path: '/category'
    },
    {
      key: 'analytics',
      icon: <DotChartOutlined />,
      label: 'Quản lý Chi Tiêu',
      path: '/analytics'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
      children: [
        { key: 'general', label: 'Cài Đặt Chung', path: '/settings/general' },
        { key: 'payment', label: 'Phương Thức Thanh Toán', path: '/settings/payment' },
        { key: 'shipping', label: 'Vận Chuyển', path: '/settings/shipping' },
        { key: 'notifications', label: 'Thông Báo', path: '/settings/notifications' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);

    const findPath = (items: CustomMenuItem[]) => {
      for (const item of items) {
        if (item.key === key && item.path) {
          navigate(item.path);
          break;
        }
        if (item.children) {
          findPath(item.children);
        }
      }
    };
    
    findPath(menuItems);
    
    // Đóng drawer nếu là mobile
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const sidebarContent = (
    <div className="relative h-full flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 px-4 bg-black/10">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white m-0 leading-tight">Vạn Dinh</h1>
              <p className="text-xs text-white/65 m-0">Tiệm Sơn</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-700">V</span>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems as MenuProps['items']}
          className="bg-transparent border-none mt-2"
        />
      </div>

      {/* Collapse Button - Desktop Only */}
      {!isMobile && (
        <div className="absolute bottom-[70px] left-0 right-0 px-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full bg-white/20 border border-white/30 text-white py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
      )}

    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0, background: 'linear-gradient(180deg, #003a8c 0%, #0050b3 100%)' }}
        width={256}
        closable={false}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop Sider
  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={80}
      width={256}
      className="overflow-auto h-screen fixed left-0 top-0 bottom-0 z-[999]"
      style={{
        background: 'linear-gradient(180deg, #003a8c 0%, #0050b3 100%)',
      }}
    >
      {sidebarContent}
    </Sider>
  );
};

export default Sidebar;