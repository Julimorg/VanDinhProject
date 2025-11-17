import React, { useState } from 'react';
import { Empty, Pagination } from 'antd';
import type { IGetMyListOrder } from '../../Interface/Order/IGetMyListOrder';
import OrderFilterSection from './Components/OrderFilterSection';
import OrderCard from './Components/OrderCard';

const OrderHistoryCardList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số lượng đơn hàng mỗi trang, có thể thay đổi thành state nếu cần

  // Sample orders data
  const [orders] = useState<IGetMyListOrder[]>([
    {
      orderId: "ORD001",
      orderCode: "EC2024110001",
      shipAddress: "123 Nguyen Hue, Quan 1, TP.HCM",
      orderAmount: 1250000,
      orderStatus: "approved",
      paymentMethod: "Credit Card",
      createAt: "2024-11-01T10:30:00",
      updateAt: "2024-11-05T14:20:00",
      completeAt: "2024-11-05T14:20:00"
    },
    {
      orderId: "ORD002",
      orderCode: "EC2024110002",
      shipAddress: "456 Le Loi, Quan 3, TP.HCM",
      orderAmount: 850000,
      orderStatus: "Pending",
      paymentMethod: "COD",
      createAt: "2024-11-03T09:15:00",
      updateAt: "2024-11-08T11:30:00",
      completeAt: null
    },
    {
      orderId: "ORD003",
      orderCode: "EC2024110003",
      shipAddress: "789 Tran Hung Dao, Quan 5, TP.HCM",
      orderAmount: 2100000,
      orderStatus: "pending",
      paymentMethod: "Bank Transfer",
      createAt: "2024-11-07T15:45:00",
      updateAt: "2024-11-07T15:45:00",
      completeAt: null
    },
    {
      orderId: "ORD004",
      orderCode: "EC2024110004",
      shipAddress: "321 Vo Van Tan, Quan 3, TP.HCM",
      orderAmount: 540000,
      orderStatus: "cancelled",
      paymentMethod: "E-Wallet",
      createAt: "2024-11-02T12:00:00",
      updateAt: "2024-11-03T10:00:00",
      completeAt: null
    },
    {
      orderId: "ORD005",
      orderCode: "EC2024110005",
      shipAddress: "555 Cach Mang Thang 8, Quan 10, TP.HCM",
      orderAmount: 3200000,
      orderStatus: "approved",
      paymentMethod: "Credit Card",
      createAt: "2024-11-09T08:20:00",
      updateAt: "2024-11-10T08:20:00",
      completeAt: "2024-11-10T08:20:00"
    },
    {
      orderId: "ORD006",
      orderCode: "EC2024110006",
      shipAddress: "999 Pham Van Dong, Thu Duc, TP.HCM",
      orderAmount: 1680000,
      orderStatus: "cancelled",
      paymentMethod: "Bank Transfer",
      createAt: "2024-11-06T14:30:00",
      updateAt: "2024-11-06T16:45:00",
      completeAt: null
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderCode.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.shipAddress.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Reset về trang đầu khi search hoặc filter thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStatus]);

  // Lấy dữ liệu cho trang hiện tại
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalItems = filteredOrders.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-500">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>

        {/* Filter Section */}
        <OrderFilterSection
          searchText={searchText}
          onSearchChange={setSearchText}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* Orders List */}
        {totalItems === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <Empty
              description={
                <span className="text-gray-500">Không tìm thấy đơn hàng nào</span>
              }
            />
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {paginatedOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={totalItems}
                pageSize={pageSize}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) =>
                  `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryCardList;