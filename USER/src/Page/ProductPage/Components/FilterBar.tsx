import React from 'react';
import { Select, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

interface FilterBarProps {
  suppliers: string[];
  categories: string[];
  filters: {
    category: string | null;
    supplier: string | null;
    sortBy: string;
  };
  onFilterChange: (key: string, value: string | null) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ suppliers, categories, filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FilterOutlined className="text-gray-600" />
        <h3 className="text-base font-semibold text-gray-800">Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          placeholder="Filter by Category"
          allowClear
          value={filters.category}
          onChange={(value) => onFilterChange('category', value)}
          className="w-full"
        >
          {categories.map(cat => (
            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
          ))}
        </Select>
        
        <Select
          placeholder="Filter by Supplier"
          allowClear
          value={filters.supplier}
          onChange={(value) => onFilterChange('supplier', value)}
          className="w-full"
        >
          {suppliers.map(sup => (
            <Select.Option key={sup} value={sup}>{sup}</Select.Option>
          ))}
        </Select>
        
        <Select
          placeholder="Sort by"
          value={filters.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
          className="w-full"
        >
          <Select.Option value="default">Default</Select.Option>
          <Select.Option value="price-asc">Price: Low to High</Select.Option>
          <Select.Option value="price-desc">Price: High to Low</Select.Option>
          <Select.Option value="name-asc">Name: A to Z</Select.Option>
          <Select.Option value="name-desc">Name: Z to A</Select.Option>
          <Select.Option value="stock-desc">Stock: High to Low</Select.Option>
        </Select>
      </div>
      {(filters.category || filters.supplier || filters.sortBy !== 'default') && (
        <Button onClick={onReset} className="mt-4" size="small">
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;