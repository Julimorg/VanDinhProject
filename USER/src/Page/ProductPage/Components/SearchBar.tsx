import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBarComp: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <Input
        size="large"
        placeholder="Search products by name or code..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        allowClear
        className="shadow-sm"
      />
    </div>
  );
};

export default SearchBarComp;