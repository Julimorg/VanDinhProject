import React from 'react';
import { Dropdown, List, } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  color: string;
}

interface NotificationDropdownProps {
  isMobile: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isMobile }) => {
  const notifications: NotificationItem[] = [
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
  );
};

export default NotificationDropdown;