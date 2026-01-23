import React from 'react';
import { Badge, Dropdown, Button, type MenuProps } from 'antd';
import { BellOutlined } from '@ant-design/icons';
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
  isMobile,
  onMarkAllRead,
  loading = false,
  refetch,
}) => {
  const [openLoading, setOpenLoading] = React.useState(false);
  const isShowLoading = loading || openLoading;
  const loadingMenuItems: MenuProps['items'] = Array.from({ length: 4 }).map(
    (_, index) => ({
      key: `loading-${index}`,
      label: (
        <div className="px-4 py-3">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ),
    })
  );
  const notificationMenuItems: MenuProps['items'] = [
    {
      type: 'group',
      key: 'header',
      label: (
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Thông báo</span>
            <span
              className={`text-sm select-none ${loading || unreadCount === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                if (loading || unreadCount === 0) {
                  return;
                }
                onMarkAllRead();
              }}
            >
              Đánh dấu đã đọc
            </span>
          </div>
        </div>
      ),

    },
    {
      type: 'divider',
    },
    ...notifications.map((notif) => ({
      key: notif.id,
      label: (
        <div className="px-2 py-2">
          <div className={`${!notif.read ? 'bg-blue-50' : ''} rounded-lg p-2 -mx-2`}>
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{notif.title}</div>
                <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.description}</div>
                <div className="text-xs text-gray-500 mt-1">{notif.time}</div>
              </div>
            </div>
          </div>
        </div>
      ),
    })),
    {
      type: 'divider',
    },
    {
      key: 'view-all',
      label: (
        <div className="text-center py-1">
          <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả thông báo
          </span>
        </div>
      ),
      onClick: () => navigate('/notifications'),
    },
  ];
  const dropdownWidth = isMobile ? 'w-[calc(100vw-2rem)] max-w-[360px]' : 'min-w-[360px] max-w-[400px]';
  const offset: [number, number] = isMobile ? [0, 0] : [0, 0];
  const [open, setOpen] = React.useState(false);

  return (
    <Dropdown
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          setOpenLoading(true);
          Promise.resolve(refetch()).finally(() => {
            setOpenLoading(false);
          });
        }
      }}
      menu={{ items: isShowLoading ? loadingMenuItems : notificationMenuItems }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="notification-dropdown"
      getPopupContainer={(triggerNode) =>
        triggerNode.parentElement ?? document.body
      }
      dropdownRender={(menu) => (
        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${dropdownWidth}`}>
          {menu}
        </div>
      )}
    >


      <Button
        type="text"
        className="h-10 px-3 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Badge count={isShowLoading ? 0 : unreadCount} size="small" offset={offset}>
          <BellOutlined
            className={`text-lg ${isShowLoading ? 'text-gray-400 animate-pulse' : 'text-gray-700'
              }`}
          />
        </Badge>
      </Button>
    </Dropdown>
  );
};

export default NotificationsDropdown;