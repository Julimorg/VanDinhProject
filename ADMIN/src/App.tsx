import ConfigProvider from 'antd/es/config-provider';
import localeVN from 'antd/locale/vi_VN';
// import GlobalStyles from './styles/GlobalStyles';
// import { ThemeProvider } from 'styled-components';
import 'antd/dist/reset.css';
// import { useEffect, useState } from 'react';
// import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import Loading from '@/Components/Loading';

import DefaultRouter from '@/Router/DefaultRoute/index';
// import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
// import PrivateRoute from './Router/PrivateRoute';
function App() {
  // check loading react-query
  // const isFetching = useIsFetching();
  // const isMutating = useIsMutating();
  // console.log("Hello1");

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
        {/* <Loading></Loading> */}
        {/* {isFetching + isMutating !== 0 && <Loading />} */}

        <BrowserRouter>
          {/* <HashRouter>  => không chạy đựo trên wweb , yêu cầu login  */}
          <DefaultRouter />
          {/* </HashRouter> */}
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export default App;
