import React, { useState } from 'react';
import { Pagination, Row, Col, Empty, Skeleton, Button } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import SearchBar from './Components/SearchBar';
import ColorCardGrid from './Components/ColorCardGrid';
import ColorCardList from './Components/ColorCardList';
import { useGetColors } from './Hook/useGetColors';
import type { IGetAllColor } from '../../Interface/Color/IGetAllColor';
import SupplierAndSortFilter from './Components/FilterAndSort';

const ColorPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>(undefined);
  const [sortValue, setSortValue] = useState('createAt,desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data: colorsData,
    isLoading,
    isError,
    error,
  } = useGetColors({
    keyword: searchKeyword,
    supplierName: supplierFilter,
    page: currentPage - 1,
    size: pageSize,
    sort: sortValue,
  });

  const rawContent = colorsData?.data?.content;
  const colors: IGetAllColor[] = Array.isArray(rawContent) ? rawContent : [];
  const totalColors = colorsData?.data?.page?.totalElements || 0;

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleSupplierChange = (value: string | undefined) => {
    setSupplierFilter(value);
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

  // Xử lý lỗi sớm để tránh render không mong muốn
  if (isError) {
    console.error('Lỗi fetch colors:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Empty description="Lỗi tải dữ liệu màu sắc. Vui lòng thử lại!" />
          <Button type="primary" onClick={() => window.location.reload()} className="mt-4">
            Tải lại trang
          </Button>
        </div>
      </div>
    );
  }

  // console.log('Colors data:', { colors, totalColors, fullData: colorsData, rawContent });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách màu sắc</h1>
              <p className="text-gray-600">Khám phá bộ sưu tập màu sắc đa dạng</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
                size="large"
              >
                Grid
              </Button>
              <Button
                type={viewMode === 'list' ? 'primary' : 'default'}
                icon={<BarsOutlined />}
                onClick={() => setViewMode('list')}
                size="large"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar - Chỉ truyền props cần thiết cho search */}
        <SearchBar onSearch={handleSearch} />

        {/* Supplier and Sort Filter - Truyền đúng props */}
        <SupplierAndSortFilter
          onSupplierChange={handleSupplierChange}
          onSortChange={handleSortChange}
          supplierValue={supplierFilter}
          sortValue={sortValue}
        />
        
        {/* Color List */}
        {isLoading ? (
          <>
            {viewMode === 'grid' ? (
              <Row gutter={[24, 24]} className="mb-8">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <Col key={`skeleton-grid-${index}`} xs={24} sm={24} md={12} lg={8}>
                    <Skeleton active avatar paragraph={{ rows: 3 }} className="h-[250px]" />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="space-y-4 mb-8">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <Skeleton
                    key={`skeleton-list-${index}`}
                    active
                    avatar
                    paragraph={{ rows: 4 }}
                    className="h-[150px]" // Adjust height để khớp ColorCardList
                  />
                ))}
              </div>
            )}
          </>
        ) : colors.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <Row gutter={[24, 24]} className="mb-8">
                {colors.map((color) => (
                  <Col key={color.colorId} xs={24} sm={24} md={12} lg={8}>
                    <ColorCardGrid color={color as IGetAllColor} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="space-y-4 mb-8">
                {colors.map((color) => (
                  <ColorCardList key={color.colorId} color={color as IGetAllColor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalColors}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} màu sắc`}
                pageSizeOptions={['6', '12', '18', '24']}
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Empty description="Không tìm thấy màu sắc" className="text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPage;