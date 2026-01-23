import React, { useEffect } from 'react';
import { Carousel, Typography, Button } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  RightOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BannerCarousel: React.FC = () => {
  const banners = [
    {
      image:
        'https://images2.thanhnien.vn/528068263637045248/2025/10/22/5-17611322637171472826509.png',
      title: 'Khuyến mãi lớn - Giảm đến 30%',
      subtitle: 'Sơn Dulux, Jotun, Nippon chính hãng',
    },
    {
      image:
        'https://images2.thanhnien.vn/zoom/1200_630/528068263637045248/2025/10/22/1-17611322634222119188377-38-0-786-1429-crop-17611325524301732071931.jpg',
      title: 'Bộ sưu tập sơn mới 2025',
      subtitle: 'Màu sắc thời thượng - Chất lượng vượt trội',
    },
    {
      image:
        'https://www.decoratingmatters.co.uk/wp-content/uploads/2024/03/web_DULUX-TRADE-VINYL-MATT.jpg',
      title: 'Sơn ngoại thất chống thấm tốt nhất',
      subtitle: 'Weathershield, Majestic, 4 Seasons...',
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div 
      className="relative mb-12 md:mb-16 rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-8 lg:mx-12"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <Carousel
        autoplay
        autoplaySpeed={6000}
        dots
        pauseOnDotsHover
        effect="fade"
        className="h-[320px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[620px] rounded-3xl"
        // Tùy chỉnh dots đẹp hơn
        dotPosition="bottom"
        // Custom class cho dots
        // dotClassName="!w-4 !h-4 !rounded-full !bg-white/40 hover:!bg-green-500 hover:!scale-125 transition-all duration-300"
        // activeDotClassName="!bg-green-600 !scale-125 shadow-lg"
      >
        {banners.map((banner, idx) => (
          <div key={idx} className="relative h-full rounded-3xl overflow-hidden">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover brightness-[0.80] scale-105 transition-transform duration-[8000ms] group-hover:scale-110"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* Nội dung text */}
            <div className="absolute bottom-8 md:bottom-12 lg:bottom-16 left-6 md:left-12 lg:left-16 max-w-2xl text-white">
              <Title
                level={2}
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 !leading-tight tracking-tight drop-shadow-lg"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                {banner.title}
              </Title>
              <Text
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 block mb-6 md:mb-8 drop-shadow-md"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                {banner.subtitle}
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<RightOutlined />}
                className="bg-green-600 border-none text-base sm:text-lg px-8 md:px-10 h-12 md:h-14 rounded-full font-semibold shadow-lg hover:!bg-green-700 hover:!shadow-xl hover:!scale-105 transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay="700"
              >
                Xem ngay
              </Button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerCarousel;