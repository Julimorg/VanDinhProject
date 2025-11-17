import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import { type LucideIcon } from 'lucide-react';

const { Title, Paragraph } = Typography;

interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = feature.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <Card
        hoverable
        className="h-full border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
            <Icon className="text-white" size={32} />
          </div>
          <Title level={4} className="mb-2">{feature.title}</Title>
          <Paragraph className="text-gray-600 mb-0">
            {feature.description}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default FeatureCard;