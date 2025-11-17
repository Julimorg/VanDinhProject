import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <div className="flex mb-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">★</span>
          ))}
        </div>
        <Paragraph className="text-gray-700 italic mb-4 flex-grow">
          "{testimonial.content}"
        </Paragraph>
        <div>
          <Title level={5} className="mb-0">{testimonial.name}</Title>
          <Paragraph className="text-gray-500 text-sm mb-0">
            {testimonial.role}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;