// Components/ProductExtraSpecs.tsx
import React from 'react';
import { Card, Typography, Tag, Empty } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

type ExtraSpecValue = string | number | boolean | null;

interface ProductExtraSpecsProps {
  data?: Record<string, ExtraSpecValue>;
}

const renderValue = (value: ExtraSpecValue) => {
  if (value === null || value === undefined || value === '') {
    return <Text type="secondary">N/A</Text>;
  }
  if (typeof value === 'boolean') {
    return value ? (
      <Tag icon={<CheckCircleFilled />} color="success">
        Có
      </Tag>
    ) : (
      <Tag icon={<CloseCircleFilled />} color="default">
        Không
      </Tag>
    );
  }
  return (
    <span className="text-sm font-medium text-blue-600" style={{ color: '#2563eb' }}>
      {String(value)}
    </span>
  );
};

const ProductExtraSpecs: React.FC<ProductExtraSpecsProps> = ({ data }) => {
  const entries = data ? Object.entries(data) : [];

  return (
    <Card title="Extra Specifications" className="!border-gray-100 !shadow-sm">
      {entries.length === 0 ? (
        <Empty description="Không có thông số bổ sung" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <Text type="secondary" className="text-sm capitalize">
                {key}
              </Text>
              {renderValue(value)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProductExtraSpecs;