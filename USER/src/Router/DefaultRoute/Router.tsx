import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import WelcomePage from '../../Page/WelcomePage/WelcomePage';
import AuthPage from '../../Page/AuthenticationPage/AuthPage';
import MainLayout from '../../Page/Main/MainLayout';
import MyProfile from '../../Page/MyProfilePage/MyProfile';
import OrderHistory from '../../Page/OrderHistoryPage/OrderHistoryPage';
import SupplierPage from '../../Page/SupplierPage/SuppliersPage';
import ColorPage from '../../Page/ColorPage/ColorPage';
import Dashboard from '../../Page/DashBoard/Dashboard';
import OrderDetailPage from '../../Page/OrderDetailPage/OrderDetailPage';
import CartPage from '../../Page/CartPage/CartPage';
import ProductsPage from '../../Page/ProductPage/ProductPage';
import ProductDetailPage from '../../Page/ProductDetailPage/ProductDetailPage';
import TransactionPage from '../../Page/TransactionPage/TransactionPage';
import PaymentResultPage from '../../Page/PaymentResultPage/PaymentResultPage';
import NotificationPage from '../../Page/NotificationPage/NotificationPage';
import SendNotiToAdminPage from '../../Components/SendNotiToAdminPage';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const AuthorizedRoute: React.FC = () => {
  const access_token = useAuthStore((state) => state.accessToken);
  if (!access_token) {
    // console.log(access_token);
    // console.log('No accessToken found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  // console.log('AccessToken found, rendering Outlet');
  return <Outlet />;
};

const UnAuthorizedRoute: React.FC = () => {
  const access_token = useAuthStore((state) => state.accessToken);
  if (access_token) {
    // console.log(access_token);
    // console.log('AccessToken exists, redirecting to /dashboard'); // Fix: Thay /home bằng /dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const DefaultRouter = () => {
  return (
    <Routes>
      <Route element={<UnAuthorizedRoute />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AuthPage />} />
      </Route>

      <Route element={<AuthorizedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="products" element={<ProductsPage />}>
            <Route path=":id" element={<ProductDetailPage />} />
          </Route>
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="suppliers" element={<SupplierPage />} />
          <Route path="colors" element={<ColorPage />} />
          <Route path="order-detail/:orderId" element={<OrderDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="transaction/:orderId" element={<TransactionPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="/send" element={<SendNotiToAdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
