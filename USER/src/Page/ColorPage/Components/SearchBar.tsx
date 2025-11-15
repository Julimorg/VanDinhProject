import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const { Search: InputSearch } = Input;

interface SearchBarProps { 
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
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
      </div>
    </div>
  );
};

export default SearchBar;