import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '@/Pages/Login/LoginPage';
import MainLayout from '@/Pages/MainLayout/MainLayout';
import UserManagement from '@/Pages/UsersManagement/UsersManagement';
import SupplierManagementPage from '@/Pages/SupplierManagement/SupplierManagementPage';
import ColorManagement from '@/Pages/ColorManagement/ColorManagementPage';
import OrderManagementPage from '@/Pages/OrderManagement/OrderManagementPage';
import ProductList from '@/Pages/ProductManagement/ProductManagePage';
import ExpenseAnalyticsDashboard from '@/Pages/AnalysticManagement/AnalysticPage';
import MyProfile from '@/Pages/MyProfile/MyProfilePage';
import DashboardPage from '@/Pages/Dashboard/DashBoardPage';
import UserDetailView from '@/Pages/UsersManagement/Components/UserDetail';
import CategoryDetail from '@/Pages/CategoryManagement/Components/CategoryDetai';
import CategoryManagementPage from '@/Pages/CategoryManagement/CategoryManagementPage';
import CreateProductPage from '@/Pages/ProductManagement/CreateProductPage';
import ProductDetailPage from '@/Pages/ProductManagement/ProductDetailPage';
import OrderDetailPage from '@/Pages/OrderManagement/OrderDetailPage';
import CreateOrderPage from '@/Pages/OrderManagement/CreateOrderPage';
import { useAuthStore } from '@/Store/IAuth';
import UpdateOrderItemsPage from '@/Pages/OrderManagement/UpdateOrderItemsPage';
import FileExporterPage from '@/Pages/FileExporter/FileExporterPage';
import ViewAllNotificationsPage from '@/Pages/Notifications/ViewAllNotificationsPage';
import SendNotificationPage from '@/Pages/Notifications/SendNotificationPage';
import ProductCsvManager from '@/Pages/ProductFileIImporter/ProductFileImporter';
import PurchaseOrderPage from '@/Pages/PurchaseOrderManagement/PurchaseOrderPage';
import PurchaseOrderDetailPage from '@/Pages/PurchaseOrderDetailManagement/PurchaseOrderDetailPage';
import UserDiaryPage from '@/Pages/UserDiaryManagement/UserDiaryPage';
import UserDiaryDetailPage from '@/Pages/UserDiaryDetailManagement/UserDiaryDetailPage';
// import PurchaseOrderDetailPage from '@/Pages/PurchaseOrderDetailManagement/PurchaseOrderDetailPage';

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

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<UnAuthorizedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AuthorizedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="users" element={<UserManagement />}>
            <Route path="user-detail/:id" element={<UserDetailView />} />
          </Route>

          <Route path="products" element={<ProductList />}>
            <Route path="create" element={<CreateProductPage />} />
            <Route path="product-detail/:productId" element={<ProductDetailPage />} />
          </Route>

          <Route path="suppliers" element={<SupplierManagementPage />} />
          <Route path="colors" element={<ColorManagement />} />

          <Route path="category" element={<CategoryManagementPage />}>
            <Route path=":categoryId" element={<CategoryDetail />} />
          </Route>

          <Route path="orders" element={<OrderManagementPage />}>
            <Route path=":orderId" element={<OrderDetailPage />} />
            <Route path="create" element={<CreateOrderPage />} />
            <Route path=":orderId/items" element={<UpdateOrderItemsPage />} />
          </Route>

          <Route path="analytics" element={<ExpenseAnalyticsDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="file-exporter" element={<FileExporterPage />} />
          <Route path="product-file-import" element={<ProductCsvManager />} />
          <Route path="notifications" element={<ViewAllNotificationsPage />} />
          <Route path="notifications/send" element={<SendNotificationPage />} />
          <Route path="/inventory" element={<PurchaseOrderPage />} />
          <Route path="inventory/:purchaseOrderId" element={<PurchaseOrderDetailPage />} />

          <Route path="/diary/:userId" element={<UserDiaryPage />} />
          <Route path="diary/:userId/:diaryId" element={<UserDiaryDetailPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
