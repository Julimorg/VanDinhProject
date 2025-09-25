import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ReceipterStatisticResponse } from '@/Interface/TRevenue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProcessedData {
  receipter_name: string;
  total_order: number;
  total_revenue: number;
  momo: string;
  cash: string;
}

interface StatisticChartProps {
  dataSource?: { data: ReceipterStatisticResponse };
  isLoading?: boolean;
}

const ReceipterStatisticChartData: React.FC<StatisticChartProps> = ({ dataSource, isLoading }) => {
  // Chuyển object thành mảng để sử dụng trong biểu đồ
  const processedData: ProcessedData[] = dataSource?.data
    ? Object.entries(dataSource.data).map(([receipter_name, details]) => ({
        receipter_name,
        total_order: details.total_order ? parseInt(details.total_order, 10) : 0,
        total_revenue: details.total_revenue ?? 0,
        momo: details.momo != null ? `${details.momo.toLocaleString('vi-VN')} VND` : '0 VND',
        cash: details.cash != null ? `${details.cash.toLocaleString('vi-VN')} VND` : '0 VND',
      }))
    : [];

  const chartData = {
    labels: processedData.map((item) => item.receipter_name),
    datasets: [
      {
        label: 'Doanh thu',
        data: processedData.map((item) => item.total_revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ Doanh thu theo Thu Ngân',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Doanh thu (VND)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Thu Ngân',
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isLoading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : processedData.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p className="text-gray-500">Không có dữ liệu để hiển thị biểu đồ</p>
      )}
    </div>
  );
};

export default ReceipterStatisticChartData;