import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/Pages/Dashborad/DashBoardPage';
import Login from '@/Pages/Login/LoginPage';
import Logout from '@/Pages/LogOut';
import MainLayout from '@/Pages/MainLayout/MainLayout';
import DetailTicketPage from '@/Pages/DetailTicket/DetailTicketPage';
import UserManagement from '@/Pages/UsersManagement/UsersManagement';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          {/* <Route path="orders" element={<OrdersPage />} /> */}
          {/* <Route path="products" element={<ProductsPage />} /> */}
          
          {/* <Route path="settings/general" element={<SettingsGeneralPage />} />
          <Route path="settings/payment" element={<SettingsPaymentPage />} />
          <Route path="settings/shipping" element={<SettingsShippingPage />} />
          <Route path="settings/notifications" element={<SettingsNotificationsPage />} /> */}
          
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
    </Routes>
  );
};

export default Router;
