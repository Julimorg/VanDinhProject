import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Dashboard/SideBar/SideBar';
import Header from '../Dashboard/Header/Header';



const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout className="min-h-screen">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
      
      <Layout 
        className="transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 256) }}
      >
        <Header 
          isMobile={isMobile}
          setDrawerVisible={setDrawerVisible}
        />
        
        <Content className="m-6 min-h-[calc(100vh-112px)]">
       
          <Outlet />
        </Content>
      </Layout>

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