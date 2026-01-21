import React, { useState } from 'react';
import { Select } from 'antd';
import type { IGetSupplierSelectionResponse } from '../../../Interface/Supplier/IGetSupplierSelection';
import { useGetSupplierSelections } from '../../../Hook/useGetSupplierSelection';
const { Option } = Select;

interface SupplierAndSortFilterProps {
  onSupplierChange: (value: string | undefined) => void;
  onSortChange: (value: string) => void;
  supplierValue: string | undefined;
  sortValue: string;
}

const SupplierAndSortFilter: React.FC<SupplierAndSortFilterProps> = ({
  onSupplierChange,
  onSortChange,
  supplierValue,
  sortValue,
}) => {
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);

  const { data: supplierResponse, isLoading: isSupplierLoading } = useGetSupplierSelections({
    enabled: isSupplierOpen,
  });

  const suppliers: IGetSupplierSelectionResponse[] = Array.isArray(supplierResponse?.data)
    ? supplierResponse.data
    : [];

  const handleDropdownVisibleChange = (open: boolean) => {
    setIsSupplierOpen(open);
    // Nếu đóng dropdown và không có value selected, có thể refetch nếu cần, nhưng ở đây giữ nguyên để tối ưu
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6"> 
      <div className="flex-1">
        <Select
          size="large"
          value={supplierValue}
          open={isSupplierOpen}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          onChange={onSupplierChange}
          className="w-full"
          placeholder={isSupplierLoading ? "Đang tải nhà cung cấp..." : "Lọc theo nhà cung cấp"}
          allowClear
          loading={isSupplierLoading}
          disabled={isSupplierLoading}
        >
          {suppliers.map((supplier) => (
            <Option key={supplier.supplierId} value={supplier.supplierName}>
              {supplier.supplierName}
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
  );
};

export default SupplierAndSortFilter;