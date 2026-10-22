import React, { useState } from 'react';
import { Pagination, Skeleton, Box, Typography } from '@mui/material';
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

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle error
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
            <p className="text-red-600 mb-4">Lỗi tải dữ liệu</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-700"
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
        <div key={index} className="bg-white rounded-lg shadow-sm border border-stone-200 p-5">
          <Skeleton height={28} className="mb-2" />
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={20} width="80%" className="mb-2" />
          <Skeleton height={20} width="40%" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-stone-500">Quản lý và theo dõi các đơn hàng của bạn</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12">
            <Box className="flex flex-col items-center justify-center gap-2 py-8">
              <Typography color="text.secondary">Không tìm thấy đơn hàng nào</Typography>
            </Box>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {orders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-2">
              <Pagination
                page={currentPage}
                onChange={handlePageChange}
                count={Math.max(1, Math.ceil(totalItems / pageSize))}
                color="primary"
              />
              <Typography variant="caption" color="text.secondary">
                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} của {totalItems} đơn hàng
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryCardList;
