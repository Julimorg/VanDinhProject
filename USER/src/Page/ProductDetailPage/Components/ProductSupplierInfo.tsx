// Components/ProductSupplierInfo.tsx
import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

interface ProductSupplierInfoProps {
  supplierName: string;
  categoryName?: string;
  productQuantity: number;
  createAt?: string;
  updateAt?: string;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <Text type="secondary" className="text-sm">
      {label}
    </Text>
    <span className="text-sm font-medium text-gray-800 text-right">{value ?? 'N/A'}</span>
  </div>
);

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
};

const ProductSupplierInfo: React.FC<ProductSupplierInfoProps> = ({
  supplierName,
  categoryName,
  productQuantity,
  createAt,
  updateAt,
}) => (
  <Card title="Supplier Information" className="!border-gray-100 !shadow-sm h-full">
    <Row label="Supplier Name" value={<span className="text-blue-600">{supplierName}</span>} />
    {categoryName && <Row label="Category Name" value={categoryName} />}
    <Row label="Product Quantity" value={`${productQuantity} cans`} />
    {createAt && <Row label="Create At" value={formatDate(createAt)} />}
    {updateAt && <Row label="Update At" value={formatDate(updateAt)} />}
  </Card>
);

export default ProductSupplierInfo;