import 'dayjs/locale/vi';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ToastContainer } from 'react-toastify';
import './index.css';
import ReactQueryProvider from '@/Provider/ReactQueryProvider';
import './i18n';
import 'flag-icon-css/css/flag-icons.min.css';

import { App as AntdApp } from 'antd';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
        <AntdApp>
          <App />
          <ToastContainer
            theme="light"
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
          />
        </AntdApp>
    </ReactQueryProvider>
  </React.StrictMode>
);
