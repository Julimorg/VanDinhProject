import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import WelcomePage from '../../Page/WelcomePage/WelcomePage';
import AuthPage from '../../Page/AuthenticationPage/AuthPage';
import MainLayout from '../../Page/Main/MainLayout';
import MyProfile from '../../Page/MyProfilePage/MyProfile';
import OrderHistory from '../../Page/OrderHistoryPage/OrderHistoryPage';
import SupplierPage from '../../Page/SupplierPage/SuppliersPage';
import Dashboard from '../../Page/DashBoard/Dashboard';
import OrderDetailPage from '../../Page/OrderDetailPage/OrderDetailPage';
import CartPage from '../../Page/CartPage/CartPage';
import ProductsPage from '../../Page/ProductPage/ProductPage';
import ProductDetailPage from '../../Page/ProductDetailPage/ProductDetailPage';
import TransactionPage from '../../Page/TransactionPage/TransactionPage';
import PaymentResultPage from '../../Page/PaymentResultPage/PaymentResultPage';
import NotificationPage from '../../Page/NotificationPage/NotificationPage';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';
import SupplierDetailPage from '@/Page/SupplierPage/SupplierDetailPage';
import NotFoundPage from '../../Page/NotFoundPage/NotFoundPage';
import AboutPage from '../../Page/PolicyPage/AboutPage';
import ContactPage from '../../Page/PolicyPage/ContactPage';
import FaqPage from '../../Page/PolicyPage/FaqPage';
import ShippingPolicyPage from '../../Page/PolicyPage/ShippingPolicyPage';
import ReturnPolicyPage from '../../Page/PolicyPage/ReturnPolicyPage';
import TermsPage from '../../Page/PolicyPage/TermsPage';
import PrivacyPage from '../../Page/PolicyPage/PrivacyPage';

const BootstrapGate: React.FC = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress sx={{ color: 'stone.900' }} />
  </Box>
);

const AuthorizedRoute: React.FC = () => {
  const access_token = useAuthStore((state) => state.accessToken);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  if (!isBootstrapped) {
    return <BootstrapGate />;
  }
  if (!access_token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const UnAuthorizedRoute: React.FC = () => {
  const access_token = useAuthStore((state) => state.accessToken);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  if (!isBootstrapped) {
    return <BootstrapGate />;
  }
  if (access_token) {
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
          <Route path="supplier-detail/:supplierId" element={<SupplierDetailPage />} />
          <Route path="order-detail/:orderId" element={<OrderDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="transaction/:orderId" element={<TransactionPage />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>

      {/* Trang thong tin/chinh sach - khong yeu cau dang nhap, van hien thi Header/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="return-policy" element={<ReturnPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="policy" element={<Navigate to="/shipping-policy" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default DefaultRouter;
