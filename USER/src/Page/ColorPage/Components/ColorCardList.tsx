import React from 'react';
import { Card, Tag } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { getformatDateWithoutMin } from '../../../Utils/utils';
import type { IGetAllColor } from '../../../Interface/Color/IGetAllColor';

interface ColorCardListProps {
  color: IGetAllColor;
}

const ColorCardList: React.FC<ColorCardListProps> = ({ color }) => {

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
            {color.colorImg && (
            <img
              src={color.colorImg}
              alt={color.colorName}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
          </div>
        </div>
        {/* Color Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              {color.colorName}
            </h3>
            <Tag color="default" className="flex-shrink-0">
              {color.colorCode}
            </Tag>
            
          </div>
         
          <p className="text-sm text-gray-600 line-clamp-2">
            {color.colorDescription}
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            {/* <div className="flex items-center gap-2">
              <span className="text-gray-500">Nhà cung cấp:</span>
              <span className="font-medium text-gray-700">
                {color.supplierName}
              </span>
            </div> */}
           
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              <span className="text-gray-500">
                {getformatDateWithoutMin(color.updateAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ColorCardList;