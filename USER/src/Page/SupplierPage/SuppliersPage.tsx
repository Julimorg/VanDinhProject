import React, { useState } from 'react';
import { Pagination, Row, Col, Empty, Spin } from 'antd';
import { mockSuppliers, type Supplier } from './mockSupplier';
import SearchFilterBar from './Components/SearchFilterBar';
import SupplierCard from './Components/SupplierCard';


const SupplierPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalSuppliers, setTotalSuppliers] = useState(mockSuppliers.length);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortValue, setSortValue] = useState('createAt,desc');

  // Handle search - You will implement API call here
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    // TODO: Call API with params: keyword={value}&size={pageSize}&page=1&sort={sortValue}
    console.log('Search API params:', {
      keyword: value,
      size: pageSize,
      page: 1,
      sort: sortValue
    });
  };

  // Handle sort change - You will implement API call here
  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
    // TODO: Call API with params: keyword={searchKeyword}&size={pageSize}&page=1&sort={value}
    console.log('Sort API params:', {
      keyword: searchKeyword,
      size: pageSize,
      page: 1,
      sort: value
    });
  };

  // Handle pagination change - You will implement API call here
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
    // TODO: Call API with params: keyword={searchKeyword}&size={pageSize}&page={page}&sort={sortValue}
    console.log('Pagination API params:', {
      keyword: searchKeyword,
      size: pageSize,
      page: page,
      sort: sortValue
    });
   
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" />
          </div>
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