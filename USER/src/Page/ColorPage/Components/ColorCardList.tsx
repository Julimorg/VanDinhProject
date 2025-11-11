import React from 'react';
import { Card, Tag } from 'antd';
import { BgColorsOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Color } from '../mockColor';

interface ColorCardListProps {
  color: Color;
}

const ColorCardList: React.FC<ColorCardListProps> = ({ color }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(color.colorCode);

  return (
    <Card
      hoverable
      className="transition-all duration-300 hover:shadow-lg border border-gray-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Color Preview */}
        <div
          className="w-full sm:w-48 h-40 sm:h-32 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner"
          style={{ backgroundColor: color.colorCode }}
        >
          <div className="text-center">
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: textColor }}
            >
              {color.colorCode}
            </div>
            <BgColorsOutlined
              className="text-3xl opacity-80"
              style={{ color: textColor }}
            />
          </div>
        </div>
        {/* Color Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              {color.colorName}
            </h3>
            <Tag color="default" className="flex-shrink-0">
              {color.colorId}
            </Tag>
          </div>
         
          <p className="text-sm text-gray-600 line-clamp-2">
            {color.colorDescription}
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Nhà cung cấp:</span>
              <span className="font-medium text-gray-700">
                {color.supplierName}
              </span>
            </div>
           
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              <span className="text-gray-500">
                {formatDate(color.updateAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ColorCardList;