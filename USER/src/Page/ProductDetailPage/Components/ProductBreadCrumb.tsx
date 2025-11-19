
import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ProductBreadcrumbProps {
  productName: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ productName }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb separator=">" style={{ marginBottom: 32, fontSize: '16px' }}>
      <Breadcrumb.Item onClick={() => navigate('/')}>
        <span className="cursor-pointer hover:text-blue-600 flex items-center gap-1">
          <HomeOutlined /> Trang chủ
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate('/products')}>
        <span className="cursor-pointer hover:text-blue-600">Sản phẩm</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span className="text-gray-900 font-medium">
          {productName.length > 40 ? `${productName.slice(0, 40)}...` : productName}
        </span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default ProductBreadcrumb;