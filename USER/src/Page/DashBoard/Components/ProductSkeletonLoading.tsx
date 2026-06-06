import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ProductSkeletonLoading: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: '1px solid #e7e5e4',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <Skeleton variant="rectangular" sx={{ aspectRatio: '1/1', width: '100%', height: 'auto' }} />

      {/* Content */}
      <Box sx={{ p: 1.75, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {/* Color label */}
        <Skeleton variant="text" width={64} height={14} />

        {/* Product name */}
        <Box>
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </Box>

        {/* Code & volume */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={56} height={12} />
          <Skeleton variant="text" width={44} height={12} />
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: '#f5f5f4' }} />

        {/* Price row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Skeleton variant="text" width={96} height={22} />
          <Box sx={{ display: 'flex', gap: 0.4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="circular" width={6} height={6} />
            ))}
          </Box>
        </Box>

        {/* Quantity */}
        <Skeleton variant="rectangular" width={128} height={28} />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" sx={{ flex: 1, height: 34 }} />
          <Skeleton variant="rectangular" sx={{ flex: 2, height: 34 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductSkeletonLoading;