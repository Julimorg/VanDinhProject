import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Search: InputSearch } = Input;
const { Option } = Select;

interface SearchFilterBarProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  sortValue: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch, onSortChange, sortValue }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <InputSearch
            placeholder="Tìm kiếm nhà cung cấp..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={onSearch}
            className="w-full"
          />
        </div>
       
        <div className="w-full lg:w-64">
          <Select
            size="large"
            value={sortValue}
            onChange={onSortChange}
            className="w-full"
            placeholder="Sắp xếp theo"
          >
            <Option value="createAt,desc">Mới nhất</Option>
            <Option value="createAt,asc">Cũ nhất</Option>
            <Option value="supplierName,asc">Tên A-Z</Option>
            <Option value="supplierName,desc">Tên Z-A</Option>
            <Option value="updateAt,desc">Cập nhật gần đây</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;