import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '@/Components/Header/Header';

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
    <Layout className="min-h-screen">
      {/* Header */}
      <Header isMobile={isMobile} />

      {/* Content */}
      <Content className="m-6 min-h-[calc(100vh-112px)] bg-gray-50"> 
        <Outlet />
      </Content>

      <style>{`
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
      `}</style>
    </Layout>
  );
};

export default MainLayout;