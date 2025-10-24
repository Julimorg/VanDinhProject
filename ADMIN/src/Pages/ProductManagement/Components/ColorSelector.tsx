import React from 'react';
import { Col, Form, Select, Spin } from 'antd';
import { FormInstance } from 'antd/es/form';
import { IGetColorSelectionResponse } from '@/Interface/Color/IGetColorSelection';
import { useGetColorSelection } from '../Hook/useGetColorSelection'; 

const { Option } = Select;

interface ColorSelectorProps {
  form: FormInstance;
  supplierId?: string; 
}

const ColorSelector: React.FC<ColorSelectorProps> = ({supplierId }) => {

  const { data: colorData, isLoading: colorLoading } = useGetColorSelection(supplierId, {
    enabled: !!supplierId,
  });

  const colors: IGetColorSelectionResponse[] = Array.isArray(colorData?.data)
    ? colorData.data
    : colorData?.data ? [colorData.data] : [];

  
//   console.log('Colors loaded for supplier:', supplierId, colors.length);

  return (
    <Col xs={24} lg={12}>
      <Form.Item
        name="colorId"
        label="Màu sắc"
        dependencies={['supplierId']} 
        rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
      >
        <Select
          placeholder="Chọn màu sắc"
          allowClear
          loading={colorLoading}
          disabled={!supplierId} 
          notFoundContent={
            colorLoading ? (
              <Spin size="small" />
            ) : !supplierId ? (
              'Vui lòng chọn nhà cung cấp trước'
            ) : (
              'Không có dữ liệu màu sắc'
            )
          }
          style={{ width: '100%' }}
        >
          {colors.map((color: IGetColorSelectionResponse) => (
            <Option key={color.colorId} value={color.colorId}>
              {color.colorName} ({color.colorCode})
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export default ColorSelector;