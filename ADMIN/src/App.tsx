import ConfigProvider from 'antd/es/config-provider';
import localeVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import DefaultRouter from '@/Router/DefaultRoute/Router';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <React.StrictMode>
      <ConfigProvider
        locale={localeVN}
        theme={{
          components: {
            Spin: {
              contentHeight: 500,
              dotSizeLG: 70,
            },
            Divider: {
              colorSplit: 'rgba(5, 5, 5, 0.16)',
            },
            Collapse: {
              // contentPadding: '0px 55px',
              headerPadding: '12px 16px 0px',
            },
          },

          token: {
            // fontSize: 15,
            colorBgLayout: '#f6f6f6',
            colorBgContainer: '#ffffff',
            colorPrimary: '#1aad88',
            colorInfo: '#0ea5e9',
            colorWarning: '#FAAD14',
            colorError: '#e71f45',
            colorLink: '#13c2c2',
          },
        }}
      >
        <BrowserRouter>
          <DefaultRouter />
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export default App;
