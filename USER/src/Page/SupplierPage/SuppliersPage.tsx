import React, { useState } from 'react';
import { Pagination, Row, Col, Empty, Skeleton, message } from 'antd'; 
import SearchFilterBar from './Components/SearchFilterBar';
import SupplierCard from './Components/SupplierCard';
import { useGetAllSupplier } from './Hook/useGetSupplier'; 
import type { IGetAllSupplierResponse } from '../../Interface/Supplier/IGetAllSuppliers';
import { toast } from 'react-toastify';

const SupplierPage: React.FC = () => {

  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(6);
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

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) setPageSize(newPageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    // console.error('Lỗi fetch suppliers:', error);
    message.error('Lỗi tải dữ liệu nhà cung cấp. Vui lòng thử lại!');
    toast.error('Lỗi tải dữ liệu nhà cung cấp. Vui lòng thử lại!');
  }
  // console.log('Suppliers data:', { suppliers, totalSuppliers, fullData: suppliersData });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Danh sách nhà cung cấp
          </h1>
          <p className="text-gray-600">
            Tìm kiếm và khám phá các nhà cung cấp uy tín
          </p>
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          sortValue={sortValue}
        />

        {/* Supplier List */}
        {isLoading ? (
          //? Skeleton loading
          <Row gutter={[24, 24]} className="mb-8">
            {Array.from({ length: pageSize }).map((_, index) => (
              <Col key={`skeleton-${index}`} xs={24} sm={24} md={12} lg={8}>
                <Skeleton 
                  active 
                  avatar 
                  paragraph={{ rows: 3 }} 
                  className="h-[300px]" 
                />
              </Col>
            ))}
          </Row>
        ) : suppliers.length > 0 ? (
          <>
            <Row gutter={[24, 24]} className="mb-8">
              {suppliers.map((supplier) => (
                <Col
                  key={supplier.supplierId}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                >
                  <SupplierCard supplier={supplier} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalSuppliers}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} nhà cung cấp`
                }
                pageSizeOptions={['6', '12', '18', '24']}
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Empty
              description="Không tìm thấy nhà cung cấp"
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPage;