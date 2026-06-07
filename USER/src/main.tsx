import 'dayjs/locale/vi';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import './index.css';
import './i18n';
import 'flag-icon-css/css/flag-icons.min.css';

import { App as AntdApp } from 'antd';
import ReactQueryProvider from './Provider/ReactQueryProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  typography: {
    fontFamily: 'inherit',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);