import Header from '@/Components/Header/Header';
import ReportPage from './ReportPage';

const Analytics = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Báo cáo và thống kê</h1>
      </div>
      <ReportPage />
    </div>
  );
};

export default Analytics;
