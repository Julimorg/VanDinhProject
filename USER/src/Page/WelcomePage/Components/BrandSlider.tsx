import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface Brand {
  id: number;
  name: string;
}

interface BrandSliderProps {
  brands: Brand[];
}

const BrandSlider: React.FC<BrandSliderProps> = ({ brands }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [brands.length]);

  return (
    <div className="relative overflow-hidden h-20 flex items-center justify-center">
      {brands.map((brand, index) => {
        const position = (index - currentIndex + brands.length) % brands.length;
        return (
          <div
            key={brand.id}
            className={`absolute transition-all duration-500 ${
              position === 0
                ? 'opacity-100 scale-100 z-10'
                : position === 1 || position === brands.length - 1
                ? 'opacity-40 scale-75'
                : 'opacity-0 scale-50'
            }`}
            style={{
              left: `${50 + (position - 1) * 30}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="bg-white rounded-lg shadow-md px-8 py-4 border-2 border-gray-200">
              <Title level={3} className="mb-0 text-gray-800">{brand.name}</Title>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandSlider;
