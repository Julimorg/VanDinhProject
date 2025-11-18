import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { ArrowRight } from 'lucide-react';
import FeatureCard from './Components/FeaturesCard';
import BrandSlider from './Components/BrandSlider';
import TestimonialCard from './Components/TestimonialCard';
import { data } from '../../Data/WelcomePageData';

const { Title, Paragraph } = Typography;

const WelcomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ top: '10%', left: '10%' }}
          />
          <div
            className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
            style={{ top: '40%', right: '10%' }}
          />
          <div
            className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
            style={{ bottom: '10%', left: '40%' }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: 1 - scrollY / 500
            }}
          >
            <Title
              level={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in"
            >
              {data.hero.title}
            </Title>
            <Title
              level={2}
              className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-6 animate-fade-in-delay"
            >
              {data.hero.subtitle}
            </Title>
            <Paragraph className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay-2">
              {data.hero.description}
            </Paragraph>
            <Button
              type="primary"
              size="large"
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleJoinClick}
            >
              {data.hero.ctaText}
              <ArrowRight className="ml-2 inline" size={20} />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Title level={2} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Tại Sao Chọn Vạn Dinh?
            </Title>
            <Paragraph className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
            </Paragraph>
          </div>
          <Row gutter={[16, 16]} className="lg:gutter-24">
            {data.features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={feature.id}>
                <FeatureCard feature={feature} index={index} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Title level={2} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Thương Hiệu Đối Tác
            </Title>
            <Paragraph className="text-base sm:text-lg text-gray-600">
              Chúng tôi hợp tác với các thương hiệu sơn hàng đầu thế giới
            </Paragraph>
          </div>
          <BrandSlider brands={data.brands} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Title level={2} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Khách Hàng Nói Gì?
            </Title>
            <Paragraph className="text-base sm:text-lg text-gray-600">
              Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
            </Paragraph>
          </div>
          <Row gutter={[16, 16]} className="lg:gutter-24">
            {data.testimonials.map((testimonial) => (
              <Col xs={24} md={12} lg={8} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={2} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Sẵn Sàng Bắt Đầu?
          </Title>
          <Paragraph className="text-base sm:text-xl mb-6 sm:mb-8 text-white opacity-90">
            Tham gia cùng hàng ngàn khách hàng đã tin tưởng Vạn Dinh
          </Paragraph>
          <Button
            size="large"
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white text-blue-600 border-none hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={handleJoinClick}
          >
            {data.hero.ctaText}
            <ArrowRight className="ml-2 inline" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Title level={3} className="text-white mb-4">Cửa Hàng Sơn Vạn Dinh</Title>
          <Paragraph className="text-gray-400 mb-2">
            Địa chỉ: Dĩ An, Hồ Chí Minh, Việt Nam
          </Paragraph>
          <Paragraph className="text-gray-400 mb-2">
            Hotline: 0123 456 789
          </Paragraph>
          <Paragraph className="text-gray-400">
            © 2024 Vạn Dinh Paint Store. All rights reserved.
          </Paragraph>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          40% { opacity: 1; }
          80% { transform: translateY(20px); opacity: 0; }
          100% { opacity: 0; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }
        
        .animate-scroll {
          animation: scroll 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;