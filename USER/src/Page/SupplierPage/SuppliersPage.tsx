import React, { useState } from 'react';
import { Pagination, Grid, Skeleton, Box, Typography } from '@mui/material';
import SearchFilterBar from './Components/SearchFilterBar';
import SupplierCard from './Components/SupplierCard';
import { useGetAllSupplier } from './Hook/useGetSupplier';
import type { IGetAllSupplierResponse } from '../../Interface/Supplier/IGetAllSuppliers';
import { toast } from 'react-toastify';

const SupplierPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [sortValue, setSortValue] = useState('createAt,desc');

  const {
    data: suppliersData,
    isLoading,
    isError,
  } = useGetAllSupplier({
    keyword: searchKeyword,
    page: currentPage - 1,
    size: pageSize,
    sort: sortValue,
  });

  const rawContent = suppliersData?.data?.content;
  const suppliers: IGetAllSupplierResponse[] = Array.isArray(rawContent) ? rawContent : [];
  const totalSuppliers = suppliersData?.data?.page.totalElements || 0;

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    toast.error('Lỗi tải dữ liệu nhà cung cấp. Vui lòng thử lại!');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách nhà cung cấp</h1>
          <p className="text-gray-600">Tìm kiếm và khám phá các nhà cung cấp uy tín</p>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          sortValue={sortValue}
        />

        {/* Supplier List */}
        {isLoading ? (
          <Grid container spacing={3} className="mb-8">
            {Array.from({ length: pageSize }).map((_, index) => (
              <Grid key={`skeleton-${index}`} size={{ xs: 12, md: 6, lg: 4 }}>
                <Skeleton variant="rounded" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : suppliers.length > 0 ? (
          <>
            <Grid container spacing={3} className="mb-8">
              {suppliers.map((supplier, i) => (
                <Grid key={supplier.supplierId} size={{ xs: 12, md: 6, lg: 4 }}>
                  <SupplierCard
                    supplier={supplier}
                    index={i}
                    linkTo={(id) => `/supplier-detail/${id}`}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box className="flex flex-col items-center gap-2 mt-8">
              <Pagination
                page={currentPage}
                count={Math.max(1, Math.ceil(totalSuppliers / pageSize))}
                onChange={handlePageChange}
                color="primary"
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
              <Typography variant="caption" color="text.secondary">
                {totalSuppliers === 0
                  ? ''
                  : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalSuppliers)} của ${totalSuppliers} nhà cung cấp`}
              </Typography>
            </Box>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Typography color="text.secondary">Không tìm thấy nhà cung cấp</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPage;
