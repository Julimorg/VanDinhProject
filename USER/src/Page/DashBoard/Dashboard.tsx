
import Header from "@/Components/Header/Header";
import StatCard from "@/Page/DashBoard/Components/StatCard";
import Chart from "@/Page/DashBoard/Components/Chart";
import QuickAccess from "@/Page/DashBoard/Components/QuickAccess";



function Dashboard() {
  return (
    
    <div className="flex-1 p-6 space-y-6 bg-gray-100 min-h-screen">
        <Header />
        <div className="flex justify-center items-center w-full h-16">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
           Dashboard
        </h1>
        </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Bán vé hôm nay" value="1,234" note="↑ 12.5% so với hôm qua" noteColor="text-green-500" />
        <StatCard title="Doanh thu hôm nay" value="12,345,678 ₫" note="↑ 12.5% so với hôm qua" noteColor="text-green-500" />
        <StatCard title="Thiết bị hoạt động" value="4/10" note="6 thiết bị đang bảo trì" noteColor="text-red-500" />
        <StatCard title="Mã giảm hoạt động" value="4" note="2 mã sắp hết hạn" noteColor="text-yellow-500" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Chart />
        <QuickAccess />
      </div>
    </div>
  );
}

export default Dashboard;
