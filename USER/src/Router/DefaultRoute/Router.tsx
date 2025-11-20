import { Routes, Route } from 'react-router-dom';
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


const DefaultRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<AuthPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="products" element={<ProductsPage />}>
          <Route path=":id" element={<ProductDetailPage />} />
        </Route>
        <Route path="suppliers" element={<SupplierPage />} />
        <Route path="colors" element={<ColorPage />} />
        <Route path="order-detail/:orderId" element={<OrderDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="transaction/:orderId" element={<TransactionPage />} />
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
