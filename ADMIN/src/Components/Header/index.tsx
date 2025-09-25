
import { Icons } from '@/Components/Icons';
import { useAuthStore } from '@/Store/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ModalBox from '../ModalBox/ModalBox';
import { useState, useEffect, useRef } from 'react';
import { useShiftStore } from '@/Hook/LocalUseContext/CrashierShift/ShiftProvider';
import ChangePasswordModal from './Component/ChangePasswordModal';
import PosDeviceModal from './Component/PosDeviceInfoModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userName = useAuthStore((state) => state.userName);
  const location = useLocation();
  const { resetShift, checkOffShift } = useShiftStore();

  const [showOnShiftModal, setShowOnShiftModal] = useState(false);
  const [showOffShiftModal, setShowOffShiftModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPosDeviceInfoModal, setShowPosDeviceInfoModal] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const handleLogout = () => {
    if (!checkOffShift) {
      setShowOffShiftModal(true);
      return;
    }
    resetShift();
    navigate('/logout');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowPosDeviceInfoModal(false); 
        setShowChangePasswordModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { key: 'dashboard', label: 'Hướng dẫn', to: '/dashboard' },
    { key: 'ticket', label: 'Bán Vé', to: '/ticket' },
    { key: 'find-ticket', label: 'Tìm Kiếm', to: '/find-ticket' },
    { key: 'shift', label: 'Ca làm việc', to: '/shift' },
    // { key: 'posdevice', label: 'IP máy', to: '/pos-device' }, --> muốn xem cấu hình cụ thể hơn thì tắt comment cái này đi 
  ];

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-6 shadow-md bg-gradient-to-r from-green-900 to-green-700 z-[1000]">
      <div className="flex items-center gap-2 ml-3">
        <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg">
          <span className="text-4xl font-bold text-pink-100">Z</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-wide text-white">ZENTRY</h1>
      </div>

      <div className="flex-1 mx-2">
        <nav className="flex justify-center gap-4 text-xl text-white">
          {menuItems.map(({ key, label, to }) => (
            <Link
              key={key}
              to={to}
              className={`px-4 py-2 rounded-md text-white text-[25px] mr-10 ml-10 transition-colors duration-300 ${
                selectedKey === key ? 'bg-white/25 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-14">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-1 text-white transition-transform hover:scale-110"
          >
            <Icons.User style={{ fontSize: 60 }} />
            <p className="text-xl">{userName}</p>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 w-64 mt-3 bg-white border border-gray-200 shadow-2xl rounded-2xl animate-fade-in">
              <div className="px-6 py-4 text-base text-gray-600 border-b">
                Tài khoản: <span className="font-semibold text-gray-900">{userName}</span>
              </div>
              <ul className="py-3">
                <li>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowPosDeviceInfoModal(true); 
                    }}
                    className="flex items-center w-full gap-3 px-6 py-3 text-lg text-left text-gray-800 transition duration-150 rounded-md hover:bg-gray-100"
                  >
                    <span>Xem thông tin của máy</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowChangePasswordModal(true);
                    }}
                    className="flex items-center w-full gap-3 px-6 py-3 text-lg text-left text-gray-800 transition duration-150 rounded-md hover:bg-gray-100"
                  >
                    <span>Đổi mật khẩu</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="text-white transition-transform hover:scale-110">
          <Icons.Logout style={{ fontSize: 60 }} />
        </button>
      </div>

      {showOnShiftModal && (
        <ModalBox
          title="Vui lòng bắt đầu ca làm"
          width="max-w-2xl"
          height="h-[10rem]"
          className="border border-gray-200 bg-gray-50"
          onOk={() => {
            setShowOnShiftModal(false);
            navigate('/shift');
          }}
          onCancel={() => setShowOnShiftModal(false)}
        >
          <div>
            <h3>Vui lòng chuyển sang trang "Ca Làm Việc" để bắt đầu ca làm</h3>
          </div>
        </ModalBox>
      )}

      {showOffShiftModal && (
        <ModalBox
          title="Vui lòng kết thúc ca để đăng xuất"
          width="max-w-2xl"
          height="h-[10rem]"
          className="border border-gray-200 bg-gray-50"
          onOk={() => {
            setShowOffShiftModal(false);
            navigate('/shift');
          }}
          onCancel={() => setShowOffShiftModal(false)}
        >
          <div>
            <h3>Vui lòng kết thúc ca để đăng xuất tài khoản</h3>
          </div>
        </ModalBox>
      )}

      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
      <PosDeviceModal
        visible={showPosDeviceInfoModal}
        onClose={() => setShowPosDeviceInfoModal(false)}
      />
    </header>
  );
};

export default Navbar;