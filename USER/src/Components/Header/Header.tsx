import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  IconButton,
  Badge,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './Components/BrandLogo';
import UserProfileDropdown from './Components/UserProfileDropdown';
import { useCartStore } from '../../Middleware/useCartStore';
import { useGetAllCarts } from './Hook/useGetAllCarts';
import NotificationsDropdown from './Components/Notification';
import { useNotificationStore } from '../../Middleware/useNotificationStore';
import { useGetNotifications } from './Hook/useGetSystemTopFiveNotifications';
import type { NotificationType } from '../../Interface/Notification/INotification';
import { useMarkNotificationAsRead } from './Hook/useMarkNotificationAsRead';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';
import { useGetUnreadNotificationCount } from './Hook/useGetUnreadCount';
import HeaderSearch from './Components/SearchDropdown';

interface HeaderProps {
  isMobile: boolean;
}

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Trang chủ', path: '/dashboard' },
  { key: 'products', label: 'Sản phẩm', path: '/products' },
  { key: 'suppliers', label: 'Nhà cung cấp', path: '/suppliers' },
];

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { id: userId, userName, email, userImg, accessToken } = useAuthStore();
  const isLoggedIn = Boolean(accessToken);

  const setCartCount = useCartStore((state) => state.setCartCount);
  const cartCount = useCartStore((state) => state.cartCount);

  const notifications = useNotificationStore((state) => state.notifications);
  const { data: unreadRes } = useGetUnreadNotificationCount(userId || undefined);
  const { refetch: refetchUnreadCount } = useGetUnreadNotificationCount(userId || undefined);

  const shouldFetch = Boolean(userId && accessToken);

  const { data: cartResponse } = useGetAllCarts(userId ?? '', { enabled: shouldFetch });
  const { data, isLoading, refetch } = useGetNotifications(userId ?? undefined, { enabled: shouldFetch });

  const navigate = useNavigate();
  const markAsRead = useMarkNotificationAsRead();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const handleMarkAllRead = () => {
    const unread = finalNotifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    useNotificationStore.getState().markAllAsRead();

    unread.forEach((noti) => {
      markAsRead.mutate(
        { userNotificationId: noti.id, body: { isRead: true } },
        {
          onSuccess: () => {
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
            refetch();
            refetchUnreadCount();
          },
          onError: (err: Error) => {
            toast.error(`Đánh dấu thất bại: ${err?.message || 'Vui lòng thử lại!'}`);
          },
        }
      );
    });
  };

  const fiveNotifications = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data?.data]);

  const apiNotifications: NotificationType[] = useMemo(
    () =>
      fiveNotifications.map((n) => ({
        id: n.userNotificationId,
        title: n.title,
        description: n.message,
        type: n.type || 'info',
        read: n.isRead,
        time: new Date(n.createdAt).toLocaleString(),
      })),
    [fiveNotifications]
  );

  const finalNotifications = useMemo(() => {
    const map = new Map<string, NotificationType>();
    apiNotifications.forEach((n) => map.set(n.id, n));
    notifications.forEach((n) => map.set(n.id, n));
    return Array.from(map.values()).slice(0, 5);
  }, [apiNotifications, notifications]);

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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!accessToken) setCartCount(0);
  }, [accessToken, setCartCount]);

  useEffect(() => {
    if (unreadRes?.data !== undefined) setUnreadCount(unreadRes.data);
  }, [unreadRes?.data, setUnreadCount]);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileNavOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'divider' : 'transparent',
          transition: 'all 0.25s ease',
          color: 'stone.900',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '72px !important', gap: 1.5 }}>
            <BrandLogo />

            <HeaderSearch />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, mx: 1 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.key}
                  onClick={() => handleNavClick(item.path)}
                  sx={{ color: 'stone.700', fontWeight: 600, px: 1.5, '&:hover': { bgcolor: 'stone.100' } }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop right */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.75 }}>
              {isLoggedIn ? (
                <>
                  <IconButton onClick={() => navigate('/cart')}>
                    <Badge
                      badgeContent={cartCount}
                      color="primary"
                      max={99}
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.62rem', fontWeight: 700 } }}
                    >
                      <ShoppingCartRoundedIcon sx={{ color: 'stone.700' }} />
                    </Badge>
                  </IconButton>

                  <NotificationsDropdown
                    notifications={finalNotifications}
                    unreadCount={unreadCount}
                    navigate={navigate}
                    isMobile={isMobile}
                    onOpen={() => {}}
                    onMarkAllRead={handleMarkAllRead}
                    loading={isLoading}
                    refetch={refetch}
                  />

                  <UserProfileDropdown
                    userName={userName || 'unknown'}
                    email={email || 'unknown'}
                    userImg={userImg || 'unknown'}
                    navigate={navigate}
                    isMobile={isMobile}
                  />
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
              )}
            </Box>

            {/* Mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.25, ml: 'auto' }}>
              {isLoggedIn && (
                <IconButton onClick={() => navigate('/cart')}>
                  <Badge badgeContent={cartCount} color="primary" max={99}>
                    <ShoppingCartRoundedIcon sx={{ color: 'stone.700', fontSize: 22 }} />
                  </Badge>
                </IconButton>
              )}
              {isLoggedIn && (
                <NotificationsDropdown
                  notifications={finalNotifications}
                  unreadCount={unreadCount}
                  navigate={navigate}
                  isMobile={isMobile}
                  onOpen={() => {}}
                  onMarkAllRead={handleMarkAllRead}
                  loading={isLoading}
                  refetch={refetch}
                />
              )}
              <IconButton onClick={() => setMobileNavOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}>
        <Box sx={{ width: 272, pt: 2 }}>
          <Box sx={{ px: 2, pb: 1.5 }}>
            <BrandLogo />
          </Box>
          <Divider />
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton key={item.key} onClick={() => handleNavClick(item.path)}>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>{item.label}</ListItemText>
              </ListItemButton>
            ))}
            {isLoggedIn ? (
              <>
                <ListItemButton onClick={() => handleNavClick('/cart')}>
                  <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>
                    Giỏ hàng ({cartCount})
                  </ListItemText>
                </ListItemButton>
                <ListItemButton onClick={() => handleNavClick('/profile')}>
                  <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Thông tin cá nhân</ListItemText>
                </ListItemButton>
                <ListItemButton onClick={() => handleNavClick('/order-history')}>
                  <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>Đơn hàng của tôi</ListItemText>
                </ListItemButton>
              </>
            ) : (
              <ListItemButton onClick={() => handleNavClick('/login')}>
                <ListItemText primaryTypographyProps={{ fontWeight: 700, color: 'primary.dark' }}>
                  Đăng nhập
                </ListItemText>
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
