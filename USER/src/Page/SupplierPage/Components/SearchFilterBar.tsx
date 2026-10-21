import React, { useState } from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface SearchFilterBarProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  sortValue: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch, onSortChange, sortValue }) => {
  const [keyword, setKeyword] = useState('');

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <TextField
            placeholder="Tìm kiếm nhà cung cấp..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch(keyword);
            }}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => onSearch(keyword)} edge="end">
                      <SearchRoundedIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className="w-full lg:w-64">
          <TextField
            select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            fullWidth
            label="Sắp xếp theo"
          >
            <MenuItem value="createAt,desc">Mới nhất</MenuItem>
            <MenuItem value="createAt,asc">Cũ nhất</MenuItem>
            <MenuItem value="supplierName,asc">Tên A-Z</MenuItem>
            <MenuItem value="supplierName,desc">Tên Z-A</MenuItem>
            <MenuItem value="updateAt,desc">Cập nhật gần đây</MenuItem>
          </TextField>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
