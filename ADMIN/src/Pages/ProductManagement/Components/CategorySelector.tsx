
import React, { useState } from 'react';
import { Col, Form, Select, Spin } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { IGetCategorySelectionResponse } from '@/Interface/Category/IGetCategorySelection'; 
import { useGetCategorySelection } from '../Hook/useGetCategorySelection';

interface CategorySelectorProps {
  form: FormInstance<any>; 
}

const { Option } = Select;

const CategorySelector: React.FC<CategorySelectorProps> = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data, isLoading } = useGetCategorySelection({
    enabled: dropdownVisible,
  });

  const categories: IGetCategorySelectionResponse[] = Array.isArray(data?.data) 
    ? data.data 
    : data?.data ? [data.data] : []; 

  const handleOpenChange = (open: boolean) => {
    if (open && !dropdownVisible) {
      setDropdownVisible(true);
    }
  };

  return (
    <Col xs={24} lg={12}>
      <Form.Item 
        name="categoryId" 
        label="Danh mục ID *"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
      >
        <Select 
          placeholder="Chọn danh mục" 
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
          {categories.map((category: IGetCategorySelectionResponse) => (
            <Option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  );
};

export default CategorySelector;