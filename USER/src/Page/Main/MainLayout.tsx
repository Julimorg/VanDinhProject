import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout className="min-h-screen overflow-x-hidden"> 
      {/* Header */}
      <Header isMobile={isMobile} />

      {/* Content */}
      <Content className="pt-[112px] min-h-[calc(100vh-112px)] bg-gray-50 overflow-x-hidden min-h-0">
        <Outlet />
      </Content>

      <Footer/>

      <style>{`
        /* Giữ nguyên style cũ, thêm rule mới để tránh menu overflow */
        .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        .ant-menu-dark .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        .ant-menu-dark .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ant-menu-dark .ant-menu-submenu-title:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        /* Thêm: Giới hạn width menu inline và force collapse nếu cần */
        .ant-layout-sider {
          max-width: 256px; /* Hoặc width cố định nếu menu quá rộng */
          flex-shrink: 0; /* Ngăn sider co lại quá mức */
        }
        .ant-menu-inline-collapsed {
          width: 80px; /* Collapse nhỏ hơn trên mobile/desktop hẹp */
        }
        /* Ẩn overflow cho sider nếu có */
        .ant-layout-sider {
          overflow-x: hidden;
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout;