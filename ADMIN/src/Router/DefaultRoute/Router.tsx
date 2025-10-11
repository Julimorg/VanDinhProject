import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/Pages/Login/LoginPage';
import Logout from '@/Pages/LogOut';
import MainLayout from '@/Pages/MainLayout/MainLayout';
import UserManagement from '@/Pages/UsersManagement/UsersManagement';
import SupplierManagementPage from '@/Pages/SupplierManagement/SupplierManagementPage';
import ColorManagement from '@/Pages/ColorManagement/ColorManagementPage';
import CategoryList from '@/Pages/CategoryManagement/CategoryManagementPage';
import OrderManagementPage from '@/Pages/OrderManagement/OrderManagementPage';
import ProductList from '@/Pages/ProductManagement/ProductManagePage';
import ExpenseAnalyticsDashboard from '@/Pages/AnalysticManagement/AnalysticPage';
import MyProfile from '@/Pages/MyProfile/MyProfilePage';
import DashboardPage from '@/Pages/Dashboard/DashBoardPage';
import UserDetailView from '@/Pages/UsersManagement/Components/UserDetail';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagement />}>
            <Route path="user-detail/:id" element={<UserDetailView />} />
          </Route>
          <Route path="products" element={<ProductList />} />
          <Route path="suppliers" element={<SupplierManagementPage />} />
          <Route path="colors" element={<ColorManagement />} />
          <Route path="category" element={<CategoryList />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="analytics" element={<ExpenseAnalyticsDashboard />} />
          <Route path="profile" element={<MyProfile />} />

          
          {/* <Route path="settings/general" element={<SettingsGeneralPage />} />
          <Route path="settings/payment" element={<SettingsPaymentPage />} />
          <Route path="settings/shipping" element={<SettingsShippingPage />} />
          <Route path="settings/notifications" element={<SettingsNotificationsPage />} /> */}
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
    </Routes>
  );
};

export default Router;
