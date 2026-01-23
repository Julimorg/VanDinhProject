import React from 'react';
import { Col, Card, Skeleton } from 'antd';

const ProductSkeletonLoading: React.FC = () => {
  return (
    <Col xs={12} sm={12} md={8} lg={6} xl={4}>
      <Card
        className="h-full rounded-xl border border-gray-200 overflow-hidden bg-white"
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <div className="w-full h-56 md:h-64 bg-gray-200 animate-pulse" />

        {/* Nội dung */}
        <div className="p-4">
          {/* Tên sản phẩm - 2 dòng */}
          <Skeleton
            active
            paragraph={{ rows: 2 }}
            title={false}
            className="mb-4"
          />

          {/* Giá + tồn kho */}
          <div className="flex justify-between mb-4">
            <Skeleton.Button active style={{ width: 110, height: 28 }} />
            <Skeleton.Button active style={{ width: 90, height: 20 }} />
          </div>

          {/* Hai nút */}
          <div className="flex gap-3">
            <Skeleton.Button active block style={{ height: 38 }} />
            <Skeleton.Button active block style={{ height: 38 }} />
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default ProductSkeletonLoading;