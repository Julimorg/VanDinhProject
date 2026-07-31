// Components/ProductAboutCard.tsx
import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

interface ProductAboutCardProps {
  description?: string;
}

// Tách mô tả thành các dòng — nếu người tạo sản phẩm viết mỗi ý trên 1 dòng
// (hoặc dùng dấu -, •) thì hiển thị dạng checklist giống mockup; ngược lại
// (mô tả là 1 đoạn văn liền) thì hiển thị dạng đoạn văn bình thường.
const splitToBullets = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

const ProductAboutCard: React.FC<ProductAboutCardProps> = ({ description }) => {
  const trimmed = description?.trim();
  const bullets = trimmed ? splitToBullets(trimmed) : [];
  const isBulletList = bullets.length > 1;

  return (
    <Card title="About the product" className="!border-gray-100 !shadow-sm h-full">
      {!trimmed ? (
        <Text type="secondary" className="text-sm">
          Sản phẩm hiện chưa có mô tả chi tiết.
        </Text>
      ) : isBulletList ? (
        <ul className="space-y-2 m-0 p-0 list-none">
          {bullets.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircleFilled className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Text className="text-sm text-gray-700 whitespace-pre-wrap" style={{ lineHeight: 1.7 }}>
          {trimmed}
        </Text>
      )}
    </Card>
  );
};

export default ProductAboutCard;