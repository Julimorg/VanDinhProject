import React from 'react';
import { Card } from 'antd';
import { BgColorsOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Color } from '../mockColor';
import { getformatDateWithoutMin } from '../../../Utils/utils';

interface ColorCardGridProps {
  color: Color;
}

const ColorCardGrid: React.FC<ColorCardGridProps> = ({ color }) => {

  const previewStyle = color.colorImg 
    ? {
        backgroundImage: `url(${color.colorImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : { backgroundColor: color.colorCode };

  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="space-y-4">
        {/* Color Preview với hình ảnh thay thế */}
        <div
          className="h-48 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner"
          style={previewStyle}
        >
          <div className="text-center z-10 bg-black bg-opacity-40 px-4 py-2 rounded">
            <div
              className="text-2xl font-bold mb-2 drop-shadow-lg"
              style={{ color: '#FFFFFF' }}
            >
              {color.colorCode}
            </div>
            <BgColorsOutlined
              className="text-3xl opacity-80 drop-shadow-lg"
              style={{ color: '#FFFFFF' }}
            />
          </div>
          <div className="absolute top-3 right-3 z-20">
            {/* <Tag color="black" className="font-semibold text-gray-700 drop-shadow-sm">
              {color.colorCode}
            </Tag> */}
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
            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Nhà cung cấp:</span>
              <span className="text-sm font-medium text-gray-700 text-right">
                {color.supplierName}
              </span>
            </div> */}
           
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400 text-xs" />
              <span className="text-xs text-gray-500">
                Cập nhật: {getformatDateWithoutMin(color.updateAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ColorCardGrid;