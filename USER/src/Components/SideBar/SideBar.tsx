import {
  TagOutlined,
  SettingOutlined,
  UserOutlined,
  BarChartOutlined,
  DesktopOutlined,
  // ScanOutlined,
  // PrinterOutlined,
  CreditCardOutlined,
  ControlOutlined,
  // TabletOutlined,
} from '@ant-design/icons';

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
      isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 h-screen p-4 bg-white shadow-md z-[1000]">
      <div className="div">
        <button onClick={() => navigate('/dashboard')}>
          <span className="flex items-center gap-2">
            <h1 className="flex items-center gap-2 mb-6 text-lg font-bold text-blue-900">
              <DesktopOutlined className="text-2xl" />
              Trang Quản Lý
            </h1>
          </span>
        </button>
      </div>

      <div>
        <button
          onClick={() => toggleMenu('ticket')}
          className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <TagOutlined />
            Quản lý dịch vụ
          </span>
          <span>{openMenu === 'ticket' ? '▲' : '▼'}</span>
        </button>

        {openMenu === 'ticket' && (
          <div className="py-2 pl-8 space-y-2">
            <NavLink to="/tickets" className={menuItemClass}>
              <TagOutlined />
              Dịch vụ
            </NavLink>

            <NavLink to="/createservicediscount" className={menuItemClass}>
              <TagOutlined />
              Áp dụng khuyến mãi
            </NavLink>
            <NavLink to="/allservicediscount" className={menuItemClass}>
              <TagOutlined />
              Dịch vụ đang giảm giá
            </NavLink>

            <NavLink to="/discountcode" className={menuItemClass}>
              <TagOutlined />
              Mã giảm giá
            </NavLink>

            <NavLink to="/manageTransaction" className={menuItemClass}>
              <TagOutlined />
              Quản lý giao dịch
            </NavLink>
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => toggleMenu('system')}
          className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <ControlOutlined />
            Quản lý hệ thống
          </span>
          <span>{openMenu === 'system' ? '▲' : '▼'}</span>
        </button>

        {openMenu === 'system' && (
          <div className="py-2 pl-8 space-y-2">
            {/* <span className="flex items-center gap-2">
              <DesktopOutlined />
              Quản lý thiết bị
            </span> */}
            {/* <div className="py-2 pl-8 space-y-2">
              <NavLink to="/devicePos" className={menuItemClass}>
                <CreditCardOutlined />
                Máy Pos
              </NavLink>
              <NavLink to="/devicePrinter" className={menuItemClass}>
                <PrinterOutlined />
                Máy in
              </NavLink>
              <NavLink to="/deviceScan" className={menuItemClass}>
                <ScanOutlined />
                Máy quét
              </NavLink>
              <NavLink to="/deviceKiosk" className={menuItemClass}>
                <TabletOutlined />
                Kiosk
              </NavLink>
            </div> */}
            <NavLink to="/users" className={menuItemClass}>
              <UserOutlined />
              Quản lý người dùng
            </NavLink>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => toggleMenu('edit-system')}
          className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <span className="flex items-center gap-2">
            <SettingOutlined />
            Cài đặt hệ thống
          </span>
          <span>{openMenu === 'edit-system' ? '▲' : '▼'}</span>
        </button>

        {openMenu === 'edit-system' && (
          <div className="py-2 pl-8 space-y-2">
            <NavLink to="/momo" className={menuItemClass}>
              <CreditCardOutlined />
              Quản Lý Momo
            </NavLink>
          </div>
        )}
      </div>
      {/* <div className="mt-4">
        <NavLink to="/settings" className={menuItemClass}>
          <SettingOutlined />
          Cài đặt hệ thống
        </NavLink>
      </div> */}
      <div className="mt-4">
        <NavLink to="/manage-gate" className={menuItemClass}>
          <BarChartOutlined />
          Quản lý cổng
        </NavLink>
      </div>
      <div className="mt-4">
        <NavLink to="/permission" className={menuItemClass}>
          <BarChartOutlined />
          Quản lý phân quyền
        </NavLink>
      </div>
      <div className="mt-4">
        <NavLink to="/reportingAndAnalysis" className={menuItemClass}>
          <BarChartOutlined />
          Báo cáo & Thống kê
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
