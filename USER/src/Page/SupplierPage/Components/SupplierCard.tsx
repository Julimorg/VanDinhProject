import React from 'react';
import { Card } from 'antd';
import type { Supplier } from '../mockSupplier';
import { CalendarOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
;

interface SupplierCardProps {
  supplier: Supplier;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-xl border border-gray-200"
      cover={
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            alt={supplier.supplierName}
            src={supplier.supplierImg}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
            <span className="text-xs font-semibold text-gray-700">
              {supplier.supplierId}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
          {supplier.supplierName}
        </h3>
       
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <EnvironmentOutlined className="text-gray-500 mt-1 flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-2">
              {supplier.supplierAddress}
            </span>
          </div>
         
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">
              {supplier.supplierPhone}
            </span>
          </div>
         
          <div className="flex items-center gap-2 pt-2">
            <CalendarOutlined className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500">
              Cập nhật: {formatDate(supplier.updateAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SupplierCard;