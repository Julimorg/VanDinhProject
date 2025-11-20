
import React from 'react';
import { Card, Tag, Typography, Space, Divider } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/pagination';

const { Title, Text } = Typography;

interface OrderItem {
  orderItemId: string;
  productName: string;
  productImage: string[];
  categoryName: string;
  productCode: string;
  colorName: string;
  productUnit: string;
  productPrice: number;
  quantity: number;
}

interface TransactionItemCardProps {
  items: OrderItem[];
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

const TransactionItemCard: React.FC<TransactionItemCardProps> = ({
  items,
  totalAmount,
  formatCurrency,
}) => {
  return (
    <Card
      title={<Title level={4} className="text-gray-800">Sản phẩm đã chọn ({items.length})</Title>}
      className="border-0 shadow-sm"
    >
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.orderItemId} className="flex gap-6 pb-8 border-b last:border-0 last:pb-0">
            {/* Swiper ảnh - chỉ có pagination, không nút next/prev */}
            <div className="flex-shrink-0">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  dynamicBullets: true, // Chấm nhỏ dần khi nhiều ảnh
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={item.productImage.length > 1}
                className="w-32 h-32 rounded-lg overflow-hidden shadow-md"
              >
                {item.productImage.length > 0 ? (
                  item.productImage.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={`${item.productName} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1">
              <Title level={5} className="mb-2 text-gray-800 line-clamp-2">
                {item.productName}
              </Title>

              <Space size="small" wrap className="mb-3">
                <Tag color="default">{item.categoryName}</Tag>
                <Tag color="default">{item.productCode}</Tag>
              </Space>

              <Text type="secondary" className="block mb-3">
                Màu: <span className="font-medium">{item.colorName}</span> • Đơn vị: {item.productUnit}
              </Text>

              <div className="flex justify-between items-end">
                <Text strong className="text-lg text-gray-700">
                  {formatCurrency(item.productPrice)} × {item.quantity}
                </Text>
                <Text strong className="text-xl text-indigo-600">
                  {formatCurrency(item.productPrice * item.quantity)}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <Divider />
      <div className="text-right space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Tạm tính:</span>
          <strong className="text-lg">{formatCurrency(totalAmount)}</strong>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <Tag color="success">Miễn phí</Tag>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between text-2xl font-bold">
          <span className="text-gray-800">Tổng cộng:</span>
          <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>


      <style>{`
        :global(.swiper-pagination) {
          bottom: 8px !important;
        }
        :global(.swiper-pagination-bullet) {
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.8;
          width: 8px;
          height: 8px;
        }
        :global(.swiper-pagination-bullet-active) {
          background: #4f46e5;
          opacity: 1;
          width: 10px;
          height: 10px;
          border: 2px solid white;
        }
      `}</style>
    </Card>
  );
};

export default TransactionItemCard;