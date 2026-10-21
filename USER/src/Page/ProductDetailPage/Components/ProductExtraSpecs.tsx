import React from 'react';
import { Card, CardHeader, CardContent, Typography, Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

type ExtraSpecValue = string | number | boolean | null;

interface ProductExtraSpecsProps {
  data?: Record<string, ExtraSpecValue>;
}

const renderValue = (value: ExtraSpecValue) => {
  if (value === null || value === undefined || value === '') {
    return <Typography color="text.secondary">N/A</Typography>;
  }
  if (typeof value === 'boolean') {
    return value ? (
      <Chip icon={<CheckCircleRoundedIcon />} label="Có" color="success" size="small" />
    ) : (
      <Chip icon={<CancelRoundedIcon />} label="Không" size="small" />
    );
  }
  return (
    <span className="text-sm font-medium" style={{ color: '#2563eb' }}>
      {String(value)}
    </span>
  );
};

const ProductExtraSpecs: React.FC<ProductExtraSpecsProps> = ({ data }) => {
  const entries = data ? Object.entries(data) : [];

  return (
    <Card variant="outlined" className="!border-gray-100 !shadow-sm">
      <CardHeader title="Extra Specifications" titleTypographyProps={{ fontSize: '1rem', fontWeight: 600 }} />
      <CardContent sx={{ pt: 0 }}>
        {entries.length === 0 ? (
          <Typography color="text.secondary" className="text-sm text-center py-4">
            Không có thông số bổ sung
          </Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <Typography color="text.secondary" className="text-sm capitalize">
                  {key}
                </Typography>
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductExtraSpecs;
