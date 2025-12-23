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
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  navigate,
  isMobile,
  onOpen
}) => {
  const notificationMenuItems: MenuProps['items'] = [
    {
      key: 'header',
      label: (
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Thông báo</span>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600">{unreadCount} chưa đọc</span>
            )}
          </div>
        </div>
      ),
      disabled: true,
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


  return (
    <Dropdown
      menu={{ items: notificationMenuItems }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="notification-dropdown"
      onOpenChange={(open) => {
        if(open){
          onOpen();
        }
      }}
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
        <Badge count={unreadCount} size="small" offset={offset}>
          <BellOutlined className="text-lg text-gray-700" />
        </Badge>
      </Button>
    </Dropdown>
  );
};

export default NotificationsDropdown;