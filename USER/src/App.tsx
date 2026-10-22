import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import DefaultRouter from './Router/DefaultRoute/Router';
import GlobalWebSocketListener from './Provider/GlobalWebSocketListener';
import AuthBootstrap from './Provider/AuthBootstrap';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthBootstrap />
        <GlobalWebSocketListener />
        <DefaultRouter />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
