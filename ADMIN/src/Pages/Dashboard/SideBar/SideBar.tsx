import React, { useState, useEffect } from 'react';
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
  ShopOutlined,
  BgColorsOutlined,
  KeyOutlined,
  DotChartOutlined,
  FileOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  drawerVisible: boolean;
  setDrawerVisible: (visible: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
  drawerVisible,
  setDrawerVisible,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKey, setSelectedKey] = useState<string>('');
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const mainPath = pathParts[0] || 'dashboard';
    setSelectedKey(mainPath);

    // Tự động mở submenu nếu đang ở child route
    if (pathParts.length > 1) {
      setOpenKeys([pathParts[0]]);
    }
  }, [location.pathname]);

  const onOpenChange = (keys: string[]) => {
    // Giữ chỉ mở 1 submenu (tùy chọn, có thể bỏ nếu muốn mở nhiều)
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Tổng Quan',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản Lý User',
      onClick: () => navigate('/users'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Quản Lý Đơn Hàng',
      onClick: () => navigate('/orders'),
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Quản Lý Sản Phẩm',
      onClick: () => navigate('/products'),
    },
    {
      key: 'supplier',
      icon: <ShopOutlined />,
      label: 'Quản Lý Nhà Cung Cấp',
      onClick: () => navigate('/suppliers'),
    },
    {
      key: 'color',
      icon: <BgColorsOutlined />,
      label: 'Quản lý mã màu',
      onClick: () => navigate('/colors'),
    },
    {
      key: 'category',
      icon: <KeyOutlined />,
      label: 'Quản lý Vật Dụng',
      onClick: () => navigate('/category'),
    },
    {
      key: 'analytics',
      icon: <DotChartOutlined />,
      label: 'Quản lý Chi Tiêu',
      onClick: () => navigate('/analytics'),
    },
    {
      key: 'file',
      icon: <FileOutlined />,
      label: 'Tệp tin',
      children: [
        {
          key: 'order-file-exporter',
          label: 'Xuất File Đơn Hàng',
          onClick: () => navigate('/file-exporter'),
        },
        {
          key: 'product-importer',
          label: 'Nhập kho sản phẩm',
          onClick: () => navigate('/product-file-import'),
        },
      ],
    },
    {
      key: 'notifications',
      icon: <NotificationOutlined />,
      label: 'Thông Báo',
      children: [
        {
          key: 'view-notifications',
          label: 'Xem toàn bộ thông báo',
          onClick: () => navigate('/notifications'),
        },
        {
          key: 'send-notifications',
          label: 'Gửi thông báo',
          onClick: () => navigate('/notifications/send'),
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
      children: [
        {
          key: 'general',
          label: 'Cài Đặt Chung',
          onClick: () => navigate('/settings/general'),
        },
        {
          key: 'payment',
          label: 'Phương Thức Thanh Toán',
          onClick: () => navigate('/settings/payment'),
        },
        {
          key: 'shipping',
          label: 'Vận Chuyển',
          onClick: () => navigate('/settings/shipping'),
        },
        {
          key: 'notifications-settings',
          label: 'Thông Báo',
          onClick: () => navigate('/settings/notifications'),
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="relative h-full flex flex-col bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-blue-700">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white m-0 leading-tight">Vạn Dinh</h1>
              <p className="text-xs text-white/70 m-0">Tiệm Sơn</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-blue-700">V</span>
          </div>
        )}
      </div>

      {/* Menu - luôn inline, hover vẫn mở xuống */}
      <div 
        className="flex-1 overflow-y-auto px-2 py-4"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}
      >
        <Menu
          theme="dark"
          mode="inline"                    // luôn inline, không đổi mode
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={menuItems}
          className="bg-transparent border-none"
          style={{ 
            background: 'transparent',
          }}
        />
      </div>

      {/* Nút thu gọn */}
      {!isMobile && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full bg-white/10 hover:bg-white/25 border border-white/20 text-white py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={72}
      width={256}
      className="h-screen fixed left-0 top-0 bottom-0 z-[1000] transition-all duration-300"
      style={{
        background: 'transparent',
        boxShadow: collapsed ? 'none' : '2px 0 8px rgba(0,0,0,0.15)',
      }}
    >
      {sidebarContent}
    </Sider>
  );
};

export default Sidebar;