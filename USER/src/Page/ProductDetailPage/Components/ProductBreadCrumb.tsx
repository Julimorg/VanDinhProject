// Components/ProductBreadCrumb.tsx
import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ProductBreadcrumbProps {
  productName: string;
  categoryName?: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ productName, categoryName }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb separator=">" className="!mb-4 sm:!mb-6 text-xs sm:text-sm">
      <Breadcrumb.Item onClick={() => navigate('/')}>
        <span className="cursor-pointer hover:text-blue-600 flex items-center gap-1">
          <HomeOutlined /> <span className="hidden sm:inline">Home</span>
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate('/products')}>
        <span className="cursor-pointer hover:text-blue-600">Sản phẩm</span>
      </Breadcrumb.Item>
      {categoryName && (
        <Breadcrumb.Item>
          <span className="text-gray-500">{categoryName}</span>
        </Breadcrumb.Item>
      )}
      <Breadcrumb.Item>
        <span className="text-gray-900 font-medium inline-block max-w-[140px] sm:max-w-[260px] md:max-w-none truncate align-bottom">
          {productName}
        </span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;