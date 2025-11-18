import React from 'react';
import { List, Tag } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { IOrderItemDetail } from '../../../Interface/Order/IGetOrderDetail';
import { formatCurrency } from '../../../Utils/utils';
import 'swiper/css';
import 'swiper/css/pagination';

interface OrderItemCardProps {
  item: IOrderItemDetail;
  index: number;
  onPreview?: (itemIndex: number) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  const hasImages = item.productImage && item.productImage.length > 0;
  const hasMultipleImages = item.productImage && item.productImage.length > 1;

  return (
    <List.Item className="border-b border-gray-100 last:border-b-0 py-4">
      <div className="w-full flex gap-4">
        {/* Image Swiper Section */}
        <div className="flex-shrink-0" style={{ width: '140px' }}>
          {hasImages ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation={false}
              pagination={hasMultipleImages ? { clickable: true } : false}
              className="rounded-lg overflow-hidden border border-gray-200"
              style={{ 
                height: '140px',
                '--swiper-pagination-color': '#6b7280',
                '--swiper-pagination-bullet-inactive-color': '#d1d5db',
                '--swiper-pagination-bullet-size': '8px',
                '--swiper-pagination-bullet-width': '8px',
                '--swiper-pagination-bullet-height': '8px',
                '--swiper-pagination-bullet-active-color': '#3b82f6',
              } as React.CSSProperties}
            >
              {item.productImage.map((img, imgIndex) => (
                <SwiperSlide key={imgIndex}>
                  <div className="relative w-full h-full bg-gray-50">
                    <img
                      src={img}
                      alt={`${item.productName} - ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/140?text=No+Image';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-[140px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Không có ảnh</span>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-grow pr-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                {item.productName}
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <Tag>{item.productCode}</Tag>
                {item.categoryName && <Tag>{item.categoryName}</Tag>}
                {item.colorName && <Tag>{item.colorName}</Tag>}
                {item.productVolume && item.productUnit && (
                  <Tag>{item.productVolume} / {item.productUnit}</Tag>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Tồn kho: <span className="font-medium text-gray-700">{item.productQuantity}</span>
              </p>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Đơn giá:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(item.productPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Số lượng:</span>
              <span className="text-sm font-medium text-gray-900">x{item.quantity}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900">Thành tiền:</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(item.productPrice * item.quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 8px;
          height: 8px;
        }

        .swiper-pagination-bullet-active {
          background: #3b82f6;
          width: 10px;
          height: 10px;
        }
      `}</style>
    </List.Item>
  );
};

export default OrderItemCard;