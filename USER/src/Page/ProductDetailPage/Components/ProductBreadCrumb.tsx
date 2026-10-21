// Components/ProductBreadCrumb.tsx
import React from 'react';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate } from 'react-router-dom';

interface ProductBreadcrumbProps {
  productName: string;
  categoryName?: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ productName, categoryName }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs separator=">" className="!mb-4 sm:!mb-6" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
      <MuiLink
        component="button"
        underline="hover"
        color="inherit"
        onClick={() => navigate('/')}
        className="flex items-center gap-1"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      >
        <HomeRoundedIcon fontSize="inherit" /> <span className="hidden sm:inline">Home</span>
      </MuiLink>
      <MuiLink component="button" underline="hover" color="inherit" onClick={() => navigate('/products')}>
        Sản phẩm
      </MuiLink>
      {categoryName && <span className="text-gray-500">{categoryName}</span>}
      <span className="text-gray-900 font-medium inline-block max-w-[140px] sm:max-w-[260px] md:max-w-none truncate align-bottom">
        {productName}
      </span>
    </Breadcrumbs>
  );
};

export default ProductBreadcrumb;
