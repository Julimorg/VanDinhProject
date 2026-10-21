import React from 'react';
import { Card, CardHeader, CardContent, Chip, Typography, Stack, Divider } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
    <Card variant="outlined" className="border-0 shadow-sm">
      <CardHeader
        title={<Typography variant="h6" className="text-gray-800">Sản phẩm đã chọn ({items.length})</Typography>}
      />
      <CardContent>
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
                    dynamicBullets: true,
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
                <Typography variant="subtitle1" className="mb-2 text-gray-800 line-clamp-2" fontWeight={600}>
                  {item.productName}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" className="mb-3">
                  <Chip label={item.categoryName} size="small" variant="outlined" />
                  <Chip label={item.productCode} size="small" variant="outlined" />
                </Stack>

                <Typography variant="body2" color="text.secondary" className="block mb-3">
                  Màu: <span className="font-medium">{item.colorName}</span> • Đơn vị: {item.productUnit}
                </Typography>

                <div className="flex justify-between items-end">
                  <Typography fontWeight={600} className="text-lg text-gray-700">
                    {formatCurrency(item.productPrice)} × {item.quantity}
                  </Typography>
                  <Typography fontWeight={600} className="text-xl text-indigo-600">
                    {formatCurrency(item.productPrice * item.quantity)}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <Divider />
        <div className="text-right space-y-3 mt-4">
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Tạm tính:</span>
            <strong className="text-lg">{formatCurrency(totalAmount)}</strong>
          </div>
          <div className="flex justify-between text-base items-center">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <Chip label="Miễn phí" color="success" size="small" />
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between text-2xl font-bold">
            <span className="text-gray-800">Tổng cộng:</span>
            <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <style>{`
          .swiper-pagination {
            bottom: 8px !important;
          }
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.7);
            opacity: 0.8;
            width: 8px;
            height: 8px;
          }
          .swiper-pagination-bullet-active {
            background: #4f46e5;
            opacity: 1;
            width: 10px;
            height: 10px;
            border: 2px solid white;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default TransactionItemCard;
