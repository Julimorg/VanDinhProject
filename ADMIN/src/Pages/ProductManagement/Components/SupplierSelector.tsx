
import React, { useState } from 'react';
import { Col, Form, Select, Spin } from 'antd';
import { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import { useGetSupplierSelections } from '../Hook/useGetSupplierSelection';



const { Option } = Select;

const SupplierSelector: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data, isLoading } = useGetSupplierSelections({
    enabled: dropdownVisible,
  });

  const suppliers: IGetSupplierSelectionResponse[] = Array.isArray(data?.data) 
    ? data.data 
    : data?.data ? [data.data] : []; 

  const handleOpenChange = (open: boolean) => {
    if (open && !dropdownVisible) {
      setDropdownVisible(true);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Form.Item name="supplierId" label="Nhà cung cấp ID">
        <Select 
          placeholder="Chọn nhà cung cấp" 
          allowClear 
          loading={isLoading}
          onOpenChange={handleOpenChange}
          notFoundContent={isLoading ? <Spin size="small" /> : 'Không có dữ liệu'}
          styles={{ 
            popup: {
              root: { 
                maxHeight: '200px',
                overflow: 'auto',
              },
            },
          }}
        >
          {suppliers.map((supplier: IGetSupplierSelectionResponse) => (
            <Option key={supplier.supplierId} value={supplier.supplierId}>
              {supplier.supplierName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export default SupplierSelector;