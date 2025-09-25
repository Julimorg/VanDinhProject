import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from '@/Components/SideBar/SideBar';
import Login from '@/Auth/Login';
import Dashboard from '@/Page/DashBoard/Dashboard';
import Ticket from '@/Page/ManageService/Ticket/Ticket';

import DevicePos from '@/Page/SystemManagement/Device/DevicePos/DevicePos';
import DevicePrinter from '@/Page/SystemManagement/Device/DevicePrinter/DevicePrinter';
import DeviceScan from '@/Page/SystemManagement/Device/DeviceScan/DeviceScan';
import DeviceKisok from '@/Page/SystemManagement/Device/DeviceKiosk/DeviceKiosk';
import Users from '@/Page/SystemManagement/Users/Users';

import SystemSettings from '@/Page/SystemSettings/SystemSettings';
import ReportingAndAnalysis from '@/Page/ReportingAndAnalysis/ReportingAndAnalysis';

import EditTicket from '@/Page/ManageService/Ticket/Components/EditTicket';

import SettingsPos from '@/Page/SystemManagement/Device/DevicePos/Components/SettingsPos';
import SettingsKiosk from '@/Page/SystemManagement/Device/DeviceKiosk/Components/SettingsKiosk';
import SettingsScan from '@/Page/SystemManagement/Device/DeviceScan/Components/SettingsScan';
import SettingsPrinter from '@/Page/SystemManagement/Device/DevicePrinter/Components/SettingsPrinter';
import AddUsers from '@/Page/SystemManagement/Users/Components/AddUsers';

import CreateService from '@/Page/ManageService/Ticket/Components/CreateService';

import EditProfile from '@/Page/EditProfile/EditProfile';
import Transaction from '@/Page/ManageService/Transaction/Transaction';
import TransactionDetail from '@/Page/ManageService/Transaction/Components/TransactionDetail';
import CreateServiceDiscount from '@/Page/ManageService/CreateDiscountService/CreateServiceDiscount';
import ServiceDiscount from '@/Page/ManageService/ServiceDiscount/ServiceDiscount';
import DiscountCode from '@/Page/ManageService/DiscountCode/DiscountCode';
import GateManagement from '@/Page/SystemManagement/Gate/GateManagement';
import ChangePassword from '@/Page/SystemSettings/Components/ChangePassword';

import MomoPage from '@/Page/MomoManagement/MomoPage';
import GateDetail from '@/Page/SystemManagement/Gate/Components/GateDetail';
import ReceipterStatisticDetail from '@/Page/ReportingAndAnalysis/Components/ReceipterStatisticDetail';
import Permission from '@/Page/Permission/Permission';

const DefaultRouter = () => {
  const LayoutWithNavbar = () => (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<LayoutWithNavbar />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Ticket />} />

        <Route path="/createservicediscount" element={<CreateServiceDiscount />} />
        <Route path="/allservicediscount" element={<ServiceDiscount />} />

        <Route path="/discountcode" element={<DiscountCode />} />

        <Route path="/devicePos" element={<DevicePos />} />
        <Route path="/devicePrinter" element={<DevicePrinter />} />
        <Route path="/deviceScan" element={<DeviceScan />} />
        <Route path="/deviceKiosk" element={<DeviceKisok />} />
        <Route path="/users" element={<Users />} />

        <Route path="/reportingAndAnalysis" element={<ReportingAndAnalysis />} />
        <Route
          path="/reportingAndAnalysis/detail/:user_id"
          element={<ReceipterStatisticDetail />}
        />
        <Route path="/settings" element={<SystemSettings />} />

        <Route path="/create-ticket" element={<CreateService />} />
        <Route path="/edit-ticket/:id" element={<EditTicket />} />

        <Route path="/edit-ticket" element={<EditTicket />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/manageTransaction" element={<Transaction />} />

        <Route path="/permission" element={<Permission />} />

        <Route path="/transaction-detail/:cart_id" element={<TransactionDetail />} />
        <Route path="/manage-gate" element={<GateManagement />} />
        <Route path="/gate-detail/:id" element={<GateDetail />} />
        <Route path="/settings-pos" element={<SettingsPos />} />
        <Route path="/settings-kiosk" element={<SettingsKiosk />} />
        <Route path="/settings-scan" element={<SettingsScan />} />
        <Route path="/settings-printer" element={<SettingsPrinter />} />
        <Route path="/add-users" element={<AddUsers />} />

        <Route path="/momo" element={<MomoPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
