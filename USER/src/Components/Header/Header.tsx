import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/Store/auth';

const Logo: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
    const userName = useAuthStore((state) => state.userName);

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="absolute top-4 right-0 w-full flex justify-end pr-6 z-50">
      <div className="relative inline-block text-left">
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1240A8' }} />
          <span className="font-semibold text-gray-700">Admin</span>
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <div className="px-6 py-4 text-sm text-gray-600 border-b">
              Tài khoản: <span className="font-semibold text-gray-900">{userName}</span>
            </div>
            <ul>
              <li>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="w-full text-left px-6 py-3 text-sm hover:bg-gray-100 rounded-b-xl text-red-600"
                >
                  Chỉnh sửa thông tin
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/change-password")}
                  className="w-full text-left px-6 py-3 text-sm hover:bg-gray-100 rounded-b-xl text-red-600"
                >
                  Đổi mật khẩu
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-sm hover:bg-gray-100 rounded-b-xl text-red-600"
                >
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
