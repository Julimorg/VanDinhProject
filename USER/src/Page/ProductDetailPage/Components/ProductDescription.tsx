
import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {

  const content = description && description.trim()
    ? description.trim()
    : 'Sản phẩm hiện chưa có mô tả chi tiết. Vui lòng liên hệ để được tư vấn thêm.';

  return (
    <div className="mt-12">

      <Title level={3} className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-4">
        Mô tả sản phẩm
      </Title>


      <Card className="border-0 shadow-sm rounded-2xl bg-gray-50/50">
        <Paragraph 
          className="text-base text-gray-700 leading-8 whitespace-pre-wrap m-0"
          style={{ lineHeight: '1.8' }}
        >
          {content}
        </Paragraph>
      </Card>
    </div>
  );
};

export default ProductDescription;