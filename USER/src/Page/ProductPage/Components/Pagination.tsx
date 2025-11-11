import React from 'react';
import { Pagination } from 'antd';

interface PaginationCompProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const PaginationComp: React.FC<PaginationCompProps> = ({ current, total, onChange }) => {
  return (
    <div className="flex justify-center mt-8">
      <Pagination
        current={current}
        total={total}
        pageSize={12}
        onChange={onChange}
        showSizeChanger={false}
        className="text-gray-600"
      />
    </div>
  );
};

export default PaginationComp;