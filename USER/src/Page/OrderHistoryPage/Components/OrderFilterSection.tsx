import React from 'react';
import { TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

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
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <TextField
          placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon className="text-stone-400" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full md:w-48"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListRoundedIcon className="text-stone-400" />
                </InputAdornment>
              ),
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="pending">Chờ duyệt</MenuItem>
          <MenuItem value="approved">Đã duyệt</MenuItem>
          <MenuItem value="canceled">Đã hủy</MenuItem>
        </TextField>
      </div>
    </div>
  );
};

export default OrderFilterSection;
