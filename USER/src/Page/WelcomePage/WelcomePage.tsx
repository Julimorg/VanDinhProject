import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Typography } from 'antd';
import { ArrowRight, Palette, Shield, Clock, Award } from 'lucide-react';

const { Title, Paragraph } = Typography;

// Data file
const data = {
  hero: {
    title: "Cửa Hàng Sơn Vạn Dinh",
    subtitle: "Giải Pháp Sơn Chất Lượng Cao - Uy Tín Hàng Đầu",
    description: "Chúng tôi tự hào mang đến cho bạn những sản phẩm sơn chất lượng cao từ các thương hiệu nổi tiếng, cùng dịch vụ tư vấn chuyên nghiệp.",
    ctaText: "Tham gia cùng Vạn Dinh"
  },
  features: [
    {
      id: 1,
      icon: Palette,
      title: "Đa Dạng Sản Phẩm",
      description: "Hơn 1000+ màu sơn và loại sơn khác nhau từ các thương hiệu uy tín"
    },
    {
      id: 2,
      icon: Shield,
      title: "Cam Kết Chất Lượng",
      description: "100% sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng"
    },
    {
      id: 3,
      icon: Clock,
      title: "Giao Hàng Nhanh",
      description: "Giao hàng trong vòng 24h tại khu vực nội thành"
    },
    {
      id: 4,
      icon: Award,
      title: "Tư Vấn Chuyên Nghiệp",
      description: "Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7"
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Anh Minh Tuấn",
      role: "Chủ thầu xây dựng",
      content: "Sơn chất lượng tuyệt vời, giá cả hợp lý. Tôi đã mua sơn ở đây cho nhiều dự án.",
      rating: 5
    },
    {
      id: 2,
      name: "Chị Thanh Hương",
      role: "Chủ nhà",
      content: "Nhân viên tư vấn rất nhiệt tình, giúp tôi chọn được màu sơn phù hợp với ngôi nhà.",
      rating: 5
    },
    {
      id: 3,
      name: "Anh Đức Anh",
      role: "Thợ sơn",
      content: "Sản phẩm đa dạng, chất lượng ổn định. Đây là nơi tôi tin tưởng nhập hàng.",
      rating: 5
    }
  ],
  brands: [
    { id: 1, name: "Dulux" },
    { id: 2, name: "Nippon" },
    { id: 3, name: "Jotun" },
    { id: 4, name: "Kansai" },
    { id: 5, name: "TOA" }
  ]
};

// FeatureCard Component
const FeatureCard = ({ feature, index }) => {
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

// TestimonialCard Component
const TestimonialCard = ({ testimonial }) => {
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

// BrandSlider Component
const BrandSlider = ({ brands }) => {
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

// Main WelcomePage Component
const WelcomePage = () => {
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

      <style jsx>{`
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