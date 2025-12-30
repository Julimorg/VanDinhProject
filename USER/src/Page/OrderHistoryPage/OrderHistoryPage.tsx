import React, { useState } from 'react';
import { Empty, Pagination, Skeleton } from 'antd';
import type { IGetMyListOrder } from '../../Interface/Order/IGetMyListOrder';
import OrderFilterSection from './Components/OrderFilterSection';
import OrderCard from './Components/OrderCard';
import { useGetMyListOrder } from './Hook/useGetMyListOrder';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const OrderHistoryCardList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const userId: string = useAuthStore(state => state.id) ?? '';


  const getStatusForApi = (status: string): string | undefined => {
    if (status === 'all') return undefined;
    return status.charAt(0).toUpperCase() + status.slice(1); 
  };

  const { data: queryData, isLoading, error, refetch } = useGetMyListOrder(
    userId,
    {
      keyword: searchText || undefined,
      status: getStatusForApi(filterStatus),
      page: currentPage - 1, 
      size: pageSize,
      sort: 'createAt,desc'
    },
    {
  
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5 phút cache
    }
  );

  const content = queryData?.data?.content;
  const orders: IGetMyListOrder[] = content == null ? [] : (Array.isArray(content) ? content : [content]);
  const totalItems = queryData?.data?.page?.totalElements || 0;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStatus]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
            <p className="text-red-500 mb-4">Lỗi tải dữ liệu</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }


  const renderSkeleton = () => (
    <div className="space-y-4 mb-6">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ))}
    </div>
  );

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
        {isLoading ? (
          renderSkeleton()
        ) : totalItems === 0 ? (
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
              {orders.map((order) => (
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