import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import DefaultRouter from './Router/DefaultRoute/Router';
import GlobalWebSocketListener from './Provider/GlobalWebSocketListener';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <GlobalWebSocketListener />
        <DefaultRouter />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
