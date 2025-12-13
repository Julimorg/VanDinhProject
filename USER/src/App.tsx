import ConfigProvider from 'antd/es/config-provider';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import DefaultRouter from './Router/DefaultRoute/Router';
import GlobalWebSocketListener from './Provider/GlobalWebSocketListener';

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider>
        <BrowserRouter>
          <GlobalWebSocketListener />
          <DefaultRouter />
          {/* <PrivateRoute /> */}
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export default App;
