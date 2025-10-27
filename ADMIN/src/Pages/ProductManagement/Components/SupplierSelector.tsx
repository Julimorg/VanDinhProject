import React, { useState } from 'react';
import { Col, Form, Select, Spin } from 'antd';
import { FormInstance } from 'antd/es/form';
import { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import { useGetSupplierSelections } from '../Hook/useGetSupplierSelection';
import ColorSelector from './ColorSelector'; 

const { Option } = Select;

interface SupplierSelectorProps {
  form: FormInstance;
}

const SupplierSelector: React.FC<SupplierSelectorProps> = ({ form }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data: supplierData, isLoading: supplierLoading } = useGetSupplierSelections({
    enabled: dropdownVisible,
  });

  const suppliers: IGetSupplierSelectionResponse[] = Array.isArray(supplierData?.data)
    ? supplierData.data
    : supplierData?.data ? [supplierData.data] : [];

  //?  Watch supplierId từ form để pass xuống ColorSelector
  const supplierId = Form.useWatch('supplierId', form);

  const handleOpenChange = (open: boolean) => {
    if (open && !dropdownVisible) {
      setDropdownVisible(true);
    }
  };

  // console.log('Current supplierId:', supplierId);

  return (
    <>
      <Col xs={24} lg={12}>
        <Form.Item
          name="supplierId"
          label="Nhà cung cấp ID"
          rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
        >
          <Select
            placeholder="Chọn nhà cung cấp"
            allowClear
            loading={supplierLoading}
            onOpenChange={handleOpenChange}
            notFoundContent={supplierLoading ? <Spin size="small" /> : 'Không có dữ liệu'}
            style={{ width: '100%' }}
          >
            {suppliers.map((supplier: IGetSupplierSelectionResponse) => (
              <Option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.supplierName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Sử dụng ColorSelector riêng */}
      <ColorSelector form={form} supplierId={supplierId} />
    </>
  );
};

export default SupplierSelector;