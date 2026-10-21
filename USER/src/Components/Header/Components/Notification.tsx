import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Divider,
  Skeleton,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import type { NotificationType } from '../../../Interface/Notification/INotification';

interface NotificationsDropdownProps {
  notifications: NotificationType[];
  unreadCount: number;
  navigate: (path: string) => void;
  isMobile: boolean;
  onOpen: () => void;
  onMarkAllRead: () => void;
  loading?: boolean;
  refetch: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  navigate,
  onMarkAllRead,
  loading = false,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const isShowLoading = loading || openLoading;
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenLoading(true);
    Promise.resolve(refetch()).finally(() => setOpenLoading(false));
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ bgcolor: open ? 'stone.100' : 'transparent' }}>
        <Badge
          badgeContent={isShowLoading ? 0 : unreadCount}
          color="error"
          max={99}
          sx={{ '& .MuiBadge-badge': { fontSize: '0.62rem', fontWeight: 700, minWidth: 16, height: 16 } }}
        >
          <NotificationsRoundedIcon sx={{ color: 'stone.700' }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: { xs: 320, sm: 380 }, mt: 1, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 800, color: 'stone.900' }}>Thông báo</Typography>
          <Typography
            onClick={() => {
              if (loading || unreadCount === 0) return;
              onMarkAllRead();
            }}
            sx={{
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: loading || unreadCount === 0 ? 'not-allowed' : 'pointer',
              color: loading || unreadCount === 0 ? 'text.disabled' : 'primary.dark',
              '&:hover': { textDecoration: loading || unreadCount === 0 ? 'none' : 'underline' },
            }}
          >
            Đánh dấu đã đọc
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {isShowLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ px: 2, py: 1.5 }}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="100%" height={12} sx={{ mt: 0.5 }} />
              </Box>
            ))
          ) : notifications.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                Chưa có thông báo nào
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <Box
                key={notif.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  gap: 1.25,
                  bgcolor: !notif.read ? 'amber.50' : 'transparent',
                  '&:hover': { bgcolor: 'stone.50' },
                  cursor: 'pointer',
                }}
                onClick={() => {
                  handleClose();
                  navigate('/notifications');
                }}
              >
                <FiberManualRecordIcon
                  sx={{ fontSize: 8, mt: 0.7, color: !notif.read ? 'primary.main' : 'stone.300', flexShrink: 0 }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'stone.900' }} noWrap>
                    {notif.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.78rem',
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {notif.description}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', mt: 0.25 }}>
                    {notif.time}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Divider />
        <Box
          sx={{ py: 1.25, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'stone.50' } }}
          onClick={() => {
            handleClose();
            navigate('/notifications');
          }}
        >
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'primary.dark' }}>
            Xem tất cả thông báo
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsDropdown;
