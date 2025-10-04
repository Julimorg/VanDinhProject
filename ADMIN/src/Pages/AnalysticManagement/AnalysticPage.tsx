import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpenseAnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value * 1000);
  };

  // KPI Data
  const kpiData = [
    { label: 'Tổng chi tiêu', value: '675,500', change: 12.5, isIncrease: true },
    { label: 'Trung bình/Ngày', value: '22,517', change: -3.2, isIncrease: false },
    { label: 'Chi phí hàng tồn', value: '328,000', change: 8.7, isIncrease: true },
    { label: 'Chi phí vận chuyển', value: '94,000', change: 15.3, isIncrease: true },
  ];

  // Line Chart Data - Xu hướng chi tiêu
  const lineChartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        label: 'Tổng chi tiêu',
        data: [95000, 107200, 100100, 123300, 114400, 135500],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Hàng tồn kho',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // Pie Chart Data - Phân bổ chi tiêu
  const pieChartData = {
    labels: ['Hàng tồn kho', 'Lương nhân viên', 'Vận chuyển', 'Marketing', 'Tiện ích'],
    datasets: [
      {
        data: [328000, 157000, 94000, 65000, 31500],
        backgroundColor: [
          '#1890ff',
          '#52c41a',
          '#faad14',
          '#722ed1',
          '#eb2f96',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return context.label + ': ' + formatCurrency(context.parsed) + ' (' + percentage + '%)';
          }
        }
      }
    }
  };

  // Bar Chart Data - Chi tiêu theo ngày
  const barChartData = {
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'],
    datasets: [
      {
        label: 'Chi tiêu',
        data: [8500, 9200, 7800, 10500, 9800, 11200, 8900, 12500, 10200, 9500, 11800, 10900, 13200, 9700],
        backgroundColor: '#1890ff',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return 'Chi tiêu: ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // Stacked Bar Chart Data - So sánh danh mục
  const stackedBarData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        label: 'Hàng tồn',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: '#1890ff',
      },
      {
        label: 'Marketing',
        data: [8000, 10000, 9000, 12000, 11000, 15000],
        backgroundColor: '#722ed1',
      },
      {
        label: 'Tiện ích',
        data: [5000, 5200, 5100, 5300, 5400, 5500],
        backgroundColor: '#faad14',
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  // Top Expenses Data
  const topExpenses = [
    { id: 1, category: 'Nhập hàng điện tử', amount: 45000, vendor: 'Samsung Vietnam', date: '2025-10-01', trend: 12, status: 'paid' },
    { id: 2, category: 'Quảng cáo Facebook', amount: 8500, vendor: 'Meta Ads', date: '2025-10-02', trend: -5, status: 'paid' },
    { id: 3, category: 'Vận chuyển quốc tế', amount: 12000, vendor: 'DHL Express', date: '2025-10-02', trend: 8, status: 'paid' },
    { id: 4, category: 'Lương tháng 10', amount: 28000, vendor: 'Nội bộ', date: '2025-10-01', trend: 0, status: 'paid' },
    { id: 5, category: 'Bảo trì website', amount: 3500, vendor: 'Tech Solutions', date: '2025-10-03', trend: -15, status: 'pending' },
  ];

  const categoryDistribution = [
    { name: 'Hàng tồn kho', value: 328000, color: '#1890ff' },
    { name: 'Lương nhân viên', value: 157000, color: '#52c41a' },
    { name: 'Vận chuyển', value: 94000, color: '#faad14' },
    { name: 'Marketing', value: 65000, color: '#722ed1' },
    { name: 'Tiện ích', value: 31500, color: '#eb2f96' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Phân tích Chi tiêu</h1>
              <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý chi phí cửa hàng</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-500 bg-white text-sm cursor-pointer"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm này</option>
              </select>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                <span className="hidden sm:inline">📊 Xuất báo cáo</span>
                <span className="sm:hidden">📊 Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(parseInt(kpi.value.replace(/,/g, '')))}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  kpi.isIncrease 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {kpi.isIncrease ? '↑' : '↓'} {Math.abs(kpi.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">Xu hướng chi tiêu theo tháng</h3>
              <p className="text-sm text-gray-500">6 tháng gần nhất</p>
            </div>
            
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">Phân bổ chi tiêu</h3>
              <p className="text-sm text-gray-500">Theo danh mục</p>
            </div>
            
            <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            <div className="mt-4 space-y-2">
              {categoryDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">Chi tiêu theo ngày</h3>
              <p className="text-sm text-gray-500">14 ngày gần nhất</p>
            </div>
            
            <div style={{ height: '250px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Stacked Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">So sánh danh mục</h3>
              <p className="text-sm text-gray-500">6 tháng gần nhất</p>
            </div>
            
            <div style={{ height: '250px' }}>
              <Bar data={stackedBarData} options={stackedBarOptions} />
            </div>
          </div>
        </div>

        {/* Top Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Chi tiêu cao nhất</h3>
                <p className="text-sm text-gray-500">Top 5 giao dịch gần đây</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả →
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhà cung cấp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Xu hướng</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{expense.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{expense.vendor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {expense.trend !== 0 ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          expense.trend > 0 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {expense.trend > 0 ? '↑' : '↓'} {Math.abs(expense.trend)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'paid'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {expense.status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {topExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">{expense.category}</p>
                    <p className="text-xs text-gray-600">{expense.vendor}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    expense.status === 'paid'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {expense.status === 'paid' ? 'Đã TT' : 'Chờ'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('vi-VN')}</span>
                    {expense.trend !== 0 && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        expense.trend > 0 
                          ? 'bg-red-50 text-red-700' 
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {expense.trend > 0 ? '↑' : '↓'} {Math.abs(expense.trend)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <span className="text-orange-500 text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-orange-900 mb-1">Cảnh báo ngân sách</h4>
              <p className="text-sm text-orange-700">
                Chi tiêu tháng này đã vượt 85% ngân sách dự kiến. Xem xét điều chỉnh các khoản chi không cần thiết.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalyticsDashboard;