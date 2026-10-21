import 'dayjs/locale/vi';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import './index.css';
import './i18n';
import 'flag-icon-css/css/flag-icons.min.css';

import ReactQueryProvider from './Provider/ReactQueryProvider';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './Theme/theme';
import ErrorBoundary from './Components/Shared/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReactQueryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer
            theme="light"
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
          />
        </ThemeProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
