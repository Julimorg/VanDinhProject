import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Badge, Button } from 'antd';
import { MenuOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './Components/BrandLogo';
import UserProfileDropdown from './Components/UserProfileDropdown';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import { useCartStore } from '../../Middleware/useCartStore';
import { useGetAllCarts } from './Hook/useGetAllCarts';
import NotificationsDropdown from './Components/Notification';
import { useNotificationStore } from "../../Middleware/useNotificationStore";
import { useGetNotifications } from './Hook/useGetSystemTopFiveNotifications';
import type { NotificationType } from '../../Interface/Notification/INotification';
interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  const { id: userId, userName, email, userImg } = useAuthStoreCookiesStorage();
  const setCartCount = useCartStore(state => state.setCartCount);
  const cartCount = useCartStore(state => state.cartCount);

  const { data: cartResponse } = useGetAllCarts(userId ?? '');
  const navigate = useNavigate();

  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const { data, isLoading } = useGetNotifications(userId ?? undefined);

  const fiveNotifications = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const apiNotifications: NotificationType[] = useMemo(() => {
    return fiveNotifications.map((n) => ({
      id: n.userNotificationId,
      title: n.title,
      description: n.message,
      type: n.type || 'info',
      read: n.isRead,
      time: new Date(n.createdAt).toLocaleString(),
    }));
  }, [fiveNotifications]);

  const finalNotifications =
    notifications.length > 0 ? notifications : apiNotifications;

  const finalUnreadCount =
    notifications.length > 0
      ? unreadCount
      : apiNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (cartResponse?.data?.items) {
      const totalQuantity = cartResponse.data.items.reduce(
        (total, item) => total + item.product.productQuantity,
        0
      );
      setCartCount(totalQuantity);
    }
  }, [cartResponse, setCartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCartCount(0);
  }, [userId, setCartCount]);

  const navItems = [
    { key: 'products', label: 'Sản phẩm', path: '/products' },
    { key: 'suppliers', label: 'Nhà Cung Cấp', path: '/suppliers' },
    { key: 'colors', label: 'Mã Màu', path: '/colors' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileNavVisible(false);
  };

  const mobileDrawer = (
    <Drawer
      title="Menu"
      placement="left"
      onClose={() => setMobileNavVisible(false)}
      open={mobileNavVisible}
      width={256}
    >
      <div className="space-y-4">
        {navItems.map((item) => (
          <Button
            key={item.key}
            type="text"
            block
            className="justify-start text-left py-3"
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </Button>
        ))}
        <Button
          type="text"
          block
          className="justify-start text-left py-3"
          onClick={() => handleNavClick('/cart')}
          icon={<ShoppingCartOutlined />}
        >
          Giỏ hàng ({cartCount})
        </Button>
      </div>
    </Drawer>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <BrandLogo />

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8 mx-8">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-2">
              <Badge count={cartCount} offset={[-5, 5]} className="cursor-pointer">
                <Button
                  type="text"
                  onClick={() => navigate('/cart')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCartOutlined className="text-lg text-gray-700" />
                </Button>
              </Badge>


              {/* <Button
                type="text"
                onClick={() => navigate('/example')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <BellOutlined className="text-lg text-gray-700" />
              </Button> */}

              <NotificationsDropdown
                notifications={finalNotifications}
                unreadCount={finalUnreadCount}
                navigate={navigate}
                isMobile={isMobile}
              />

              <UserProfileDropdown
                userName={userName || 'unknown'}
                email={email || 'unknown'}
                userImg={userImg || 'unknown'}
                navigate={navigate}
                isMobile={isMobile}
              />
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                type="text"
                icon={<MenuOutlined className="text-lg" />}
                onClick={() => setMobileNavVisible(true)}
                className="p-2"
              />
              <Badge count={cartCount} offset={[-5, 5]} className="cursor-pointer">
                <Button
                  type="text"
                  onClick={() => navigate('/cart')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCartOutlined className="text-lg text-gray-700" />
                </Button>
              </Badge>

              {/* dropdown noti */}
              {/* <Button
                type="text"
                onClick={() => navigate('/example')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <BellOutlined className="text-lg text-gray-700" />
              </Button> */}

              <NotificationsDropdown
                notifications={finalNotifications}
                unreadCount={finalUnreadCount}
                navigate={navigate}
                isMobile={isMobile}
              />

              <UserProfileDropdown
                userName={userName || 'unknown'}
                email={email || 'unknown'}
                userImg={userImg || 'unknown'}
                navigate={navigate}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawer}
    </>
  );
};

export default Header;
