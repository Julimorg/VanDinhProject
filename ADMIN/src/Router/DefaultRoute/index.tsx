import { Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from '@/Pages/Dashborad';
import FindTicket from '@/Pages/FindTicket/FindTicketPage';
import Shift from '@/Pages/Shift/ShiftPage';
import Ticket from '@/Pages/Ticket';
import Report from '@/Pages/Report';
import Navbar from '@/Components/Header';
import DetailTicketPage from '@/Pages/DetailTicket/DetailTicketPage';
import PayInfo from '@/Pages/Ticket/Payment/PayInfo';
import Invoice from '@/Pages/Ticket/Invoice/Invoice';
import PosInfo from '@/Pages/PosDeviceIno/PosDeviceInfo';
import Login from '@/Pages/Login/LoginPage';
import Logout from '@/Pages/LogOut';

const DefaultRouter = () => {
  const LayoutWithNavbar = () => (
    <>
      <Navbar />
      <main className="p-4 mb-[1rem] mt-[6rem]">
        <Outlet />
      </main>
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route element={<LayoutWithNavbar />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/pay-info" element={<PayInfo />} />
        <Route path="/find-ticket" element={<FindTicket />}>
          <Route path="detail-ticket/:contractID" element={<DetailTicketPage />} />
        </Route>
        <Route path="/shift" element={<Shift />} />
        <Route path="/report" element={<Report />} />
        {/* <Route path="/testsignalR" element={<TestSignalR />} /> */}
        <Route path="/pos-device" element={<PosInfo />} />
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
