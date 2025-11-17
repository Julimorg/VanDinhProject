import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

interface OrderFilterSectionProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

const OrderFilterSection: React.FC<OrderFilterSectionProps> = ({
  searchText,
  onSearchChange,
  filterStatus,
  onFilterChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
          size="large"
          style={{ borderRadius: '8px' }}
        />
        <Select
          placeholder="Trạng thái"
          value={filterStatus}
          onChange={onFilterChange}
          className="w-full md:w-48"
          size="large"
          suffixIcon={<FilterOutlined className="text-gray-400" />}
        >
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="pending">Chờ duyệt</Select.Option>
          <Select.Option value="approved">Đã duyệt</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default OrderFilterSection;