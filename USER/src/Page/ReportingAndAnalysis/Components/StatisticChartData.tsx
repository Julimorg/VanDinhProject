
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
import type { StatisticResponse } from '@/Interface/TRevenue';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProcessedData {
  service_name: string;
  quantity: number;
  price: number;
  momo: number;
  cash: number;
  revenue: number;
}

interface StatisticChartProps {
  dataSource: StatisticResponse;
  isLoading: boolean;
}

const StatisticChartData: React.FC<StatisticChartProps> = ({ dataSource, isLoading }) => {

  const processedData: ProcessedData[] = Object.entries(dataSource).map(([service_name, details]) => ({
    service_name,
    quantity: details.quantity,
    price: details.price,
    momo: details.momo,
    cash: details.cash,
    revenue: details.quantity * details.price,
  }));

  const chartData = {
    labels: processedData.map((item) => item.service_name),
    datasets: [
      {
        label: 'Doanh thu',
        data: processedData.map((item) => item.revenue),
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
        text: 'Biểu đồ Doanh thu theo Dịch vụ',
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
          text: 'Dịch vụ',
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

export default StatisticChartData;