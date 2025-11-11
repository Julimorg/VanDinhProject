import React from 'react';
import { Card, Tag } from 'antd';
import { BgColorsOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Color } from '../mockColor';

interface ColorCardGridProps {
  color: Color;
}

const ColorCardGrid: React.FC<ColorCardGridProps> = ({ color }) => {
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
      className="h-full transition-all duration-300 hover:shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="space-y-4">
        {/* Color Preview */}
        <div
          className="h-48 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner"
          style={{ backgroundColor: color.colorCode }}
        >
          <div className="text-center z-10">
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: textColor }}
            >
              {color.colorCode}
            </div>
            <BgColorsOutlined
              className="text-4xl opacity-80"
              style={{ color: textColor }}
            />
          </div>
          <div className="absolute top-3 right-3">
            <Tag color="white" className="font-semibold text-gray-700">
              {color.colorId}
            </Tag>
          </div>
        </div>
        {/* Color Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800">
            {color.colorName}
          </h3>
         
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {color.colorDescription}
          </p>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Nhà cung cấp:</span>
              <span className="text-sm font-medium text-gray-700 text-right">
                {color.supplierName}
              </span>
            </div>
           
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400 text-xs" />
              <span className="text-xs text-gray-500">
                Cập nhật: {formatDate(color.updateAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ColorCardGrid;