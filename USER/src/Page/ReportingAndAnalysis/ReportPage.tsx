import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { FaDownload } from 'react-icons/fa';
import { useGetStatisticOption } from './Hooks/useGetStatisticRevenue';
import { useGetReceipterStatistic } from './Hooks/useGetReceipterStatistic';
import { toast } from 'react-toastify';
import StatisticChartData from './Components/StatisticChartData';
import StatisticTableData from './Components/StasticticTableData';
import ReceipterStatisticTable from './Components/ReceipterStatisticTable';
import { useExportExcel } from './Hooks/useExcelExporter';
import Loading from '@/Components/Loading';
import ReceipterStatisticChartData from './Components/ReceipterStatisticChartData';
import { useExportReceipterExcel } from './Hooks/useReceipterExcelExporter';

const ReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fetchData, setFetchData] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [showStatisticData, setShowStatisticData] = useState<boolean>(false);
  const [showReceipterData, setShowReceipterData] = useState<boolean>(false);

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue,
  } = useGetStatisticOption(startDate, endDate, {
    enabled: fetchData && !!startDate && !!endDate && showStatisticData,
  });

  const {
    data: receipterData,
    isLoading: receipterLoading,
    error: receipterError,
    refetch: refetchReceipter,
  } = useGetReceipterStatistic(startDate, endDate, {
    enabled: fetchData && !!startDate && !!endDate && showReceipterData,
  });

  const { mutate, isPending } = useExportExcel({
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${variables.fromDate}_to_${variables.toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Export File Excel thành công');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Không thể xuất file Excel';
      toast.error(errorMessage);
    },
  });
  const { mutate: exportReceipter, isPending: Pending } = useExportReceipterExcel({
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${variables.fromDate}_to_${variables.toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Export File Excel thành công');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Không thể xuất file Excel';
      toast.error(errorMessage);
    },
  });

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
      return;
    }
    if (revenueError?.response?.status === 400) {
      toast.error('Không có dữ liệu của vé trong thời gian này !');
      return;
    }
    setFetchData(true);
    setShowStatisticData(true);
    setShowReceipterData(false);
    refetchRevenue().then(() => {
      console.log('Revenue API Data:', revenueData);
    });
  };

  const handleGenerateReceipterReport = () => {
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
      return;
    }
    if (receipterError?.response?.status === 400) {
      toast.error('Không có dữ liệu của vé trong thời gian này !');
      return;
    }
    setFetchData(true);
    setShowReceipterData(true);
    setShowStatisticData(false);
    console.log('Receipter API Data:', receipterData);
    refetchReceipter().then(() => {
      console.log('Receipter API Data:', receipterData);
    });
  };

  const handleExportExcel = () => {
    if (!revenueData || Object.keys(revenueData).length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    // const requestBody: StatisticResponse = revenueData;
    mutate({
      fromDate: startDate,
      toDate: endDate,
    });
  };

  const handleExportReceipterExcel = () => {
    if (!receipterData || Object.keys(receipterData).length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    // const requestBody: ReceipterStatisticResponseData = receipterData;
    exportReceipter({
      fromDate: startDate,
      toDate: endDate,
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50">
      {isPending && <Loading />}
      {Pending && <Loading />}
      <div className="p-4 space-y-4 bg-white rounded shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
            <DatePicker
              className="w-full p-2"
              placeholder="Chọn ngày bắt đầu"
              format="DD/MM/YYYY"
              onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
            <DatePicker
              className="w-full p-2"
              placeholder="Chọn ngày kết thúc"
              format="DD/MM/YYYY"
              onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')}
            />
          </div>
        </div>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 mr-[25px]"
          onClick={handleGenerateReport}
        >
          Tạo báo cáo theo doanh thu
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={handleGenerateReceipterReport}
        >
          Tạo báo cáo theo lễ tân
        </button>
      </div>
      {/* Statistic Data */}
      {showStatisticData && (
        <div className="p-4 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setViewMode('table')}
              >
                Bảng
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setViewMode('chart')}
              >
                Biểu đồ
              </button>
            </div>
            <span className="text-xl font-bold">Quản Lý Doanh Thu</span>
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
              onClick={handleExportExcel}
            >
              <FaDownload /> Xuất file Excel
            </button>
          </div>
          {viewMode === 'table' ? (
            <StatisticTableData dataSource={revenueData} isLoading={revenueLoading} />
          ) : (
            <div className="max-w-4xl mx-auto">
              {revenueData && Object.keys(revenueData).length > 0 ? (
                <StatisticChartData dataSource={revenueData} isLoading={revenueLoading} />
              ) : (
                <p className="text-gray-500">Không có dữ liệu để hiển thị biểu đồ</p>
              )}
            </div>
          )}
        </div>
      )}
      {/* Receipter Data */}
      {showReceipterData && (
        <div className="p-4 bg-white rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setViewMode('table')}
              >
                Bảng
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setViewMode('chart')}
              >
                Biểu đồ
              </button>
            </div>
            <span className="text-xl font-bold">Doanh Thu Theo Thu Ngân</span>
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
              onClick={handleExportReceipterExcel}
            >
              <FaDownload /> Xuất file Excel
            </button>
          </div>
          {viewMode === 'table' ? (
            <ReceipterStatisticTable dataSource={receipterData} isLoading={receipterLoading} startDate = {startDate} endDate = {endDate}/>
          ) : (
            <div className="max-w-4xl mx-auto">
              {receipterData && Object.keys(receipterData).length > 0 ? (
                <ReceipterStatisticChartData dataSource={receipterData} isLoading={receipterLoading} />
              ) : (
                <p className="text-gray-500">Không có dữ liệu để hiển thị biểu đồ</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;