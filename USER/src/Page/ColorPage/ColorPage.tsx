import React, { useState } from 'react';
import { Pagination, Row, Col, Empty, Spin, Button } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { mockColors, mockSuppliers, type Color } from './mockColor';
import SearchFilterBar from './Components/SearchFilterBar';
import ColorCardGrid from './Components/ColorCardGrid';
import ColorCardList from './Components/ColorCardList';


const ColorPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<Color[]>(mockColors);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalColors, setTotalColors] = useState(mockColors.length);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>(undefined);
  const [sortValue, setSortValue] = useState('createAt,desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle search - You will implement API call here
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
    // TODO: Call API with params
    console.log('Search API params:', {
      keyword: value,
      supplierName: supplierFilter,
      size: pageSize,
      page: 1,
      sort: sortValue
    });
  };

  // Handle supplier filter change - You will implement API call here
  const handleSupplierChange = (value: string | undefined) => {
    setSupplierFilter(value);
    setCurrentPage(1);
    // TODO: Call API with params
    console.log('Filter API params:', {
      keyword: searchKeyword,
      supplierName: value,
      size: pageSize,
      page: 1,
      sort: sortValue
    });
  };

  // Handle sort change - You will implement API call here
  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
    // TODO: Call API with params
    console.log('Sort API params:', {
      keyword: searchKeyword,
      supplierName: supplierFilter,
      size: pageSize,
      page: 1,
      sort: value
    });
  };

  // Handle pagination change - You will implement API call here
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
    // TODO: Call API with params
    console.log('Pagination API params:', {
      keyword: searchKeyword,
      supplierName: supplierFilter,
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Danh sách màu sắc
              </h1>
              <p className="text-gray-600">
                Khám phá bộ sưu tập màu sắc đa dạng
              </p>
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

        {/* Search and Filter Bar */}
        <SearchFilterBar
          onSearch={handleSearch}
          onSupplierChange={handleSupplierChange}
          onSortChange={handleSortChange}
          supplierValue={supplierFilter}
          sortValue={sortValue}
          suppliers={mockSuppliers}
        />

        {/* Color List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" />
          </div>
        ) : colors.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <Row gutter={[24, 24]} className="mb-8">
                {colors.map((color) => (
                  <Col
                    key={color.colorId}
                    xs={24}
                    sm={24}
                    md={12}
                    lg={8}
                  >
                    <ColorCardGrid color={color} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="space-y-4 mb-8">
                {colors.map((color) => (
                  <ColorCardList key={color.colorId} color={color} />
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
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} của ${total} màu sắc`
                }
                pageSizeOptions={['6', '12', '18', '24']}
                className="bg-white px-4 py-3 rounded-lg shadow-sm"
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <Empty
              description="Không tìm thấy màu sắc"
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPage;