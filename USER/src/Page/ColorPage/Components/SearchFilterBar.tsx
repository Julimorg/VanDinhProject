import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Search: InputSearch } = Input;
const { Option } = Select;

interface SearchFilterBarProps {
  onSearch: (value: string) => void;
  onSupplierChange: (value: string | undefined) => void;
  onSortChange: (value: string) => void;
  supplierValue: string | undefined;
  sortValue: string;
  suppliers: string[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onSearch,
  onSupplierChange,
  onSortChange,
  supplierValue,
  sortValue,
  suppliers
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="w-full">
          <InputSearch
            placeholder="Tìm kiếm theo tên màu hoặc mã màu..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={onSearch}
            className="w-full"
          />
        </div>
       
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              size="large"
              value={supplierValue}
              onChange={onSupplierChange}
              className="w-full"
              placeholder="Lọc theo nhà cung cấp"
              allowClear
            >
              {suppliers.map((supplier) => (
                <Option key={supplier} value={supplier}>
                  {supplier}
                </Option>
              ))}
            </Select>
          </div>
         
          <div className="flex-1">
            <Select
              size="large"
              value={sortValue}
              onChange={onSortChange}
              className="w-full"
              placeholder="Sắp xếp theo"
            >
              <Option value="createAt,desc">Mới nhất</Option>
              <Option value="createAt,asc">Cũ nhất</Option>
              <Option value="colorName,asc">Tên A-Z</Option>
              <Option value="colorName,desc">Tên Z-A</Option>
              <Option value="updateAt,desc">Cập nhật gần đây</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;