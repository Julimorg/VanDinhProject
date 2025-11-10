import { Routes, Route } from 'react-router-dom';

import MainLayout from '@/Page/Main/MainLayout';
import WelcomePage from '@/Page/WelcomePage/WelcomePage';
import AuthPage from '@/Page/AuthenticationPage/AuthPage';
import Dashboard from '@/Page/DashBoard/DashBoard';
import MyProfile from '@/Page/MyProfilePage/MyProfile';
import OrderHistory from '@/Page/OrderHistoryPage/OrderHistoryPage';

const DefaultRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<AuthPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="order-history" element={<OrderHistory />} />

        
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
