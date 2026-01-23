import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-400 to-gray-900 text-white py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Row gutter={[32, 48]}>
          {/* Cột 1: Giới thiệu thương hiệu */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={4} className="text-white mb-5 font-bold text-2xl tracking-tight">
              Vạn Đinh Paint
            </Title>
            <Text className="text-white leading-relaxed block mb-5 text-base">
              Chuyên cung cấp sơn nội thất, ngoại thất chính hãng từ các thương hiệu hàng đầu:{' '}
              <span className="font-medium text-blue-300">
                Dulux, Jotun, Nippon, Kova, TOA...
              </span>
            </Text>
            <Text className="text-white font-medium text-sm uppercase tracking-wide">
              Uy tín – Chất lượng – Giá tốt nhất TP.HCM
            </Text>
          </Col>

          {/* Cột 2: Liên kết nhanh */}
          <Col xs={24} sm={12} lg={5}>
            <Title level={5} className="text-white mb-5 font-semibold text-lg">
              Liên kết nhanh
            </Title>
            <ul className="space-y-3">
              {[
                { label: 'Sản phẩm', href: '/products' },
                { label: 'Khuyến mãi', href: '/promotions' },
                { label: 'Giới thiệu', href: '/about' },
                { label: 'Liên hệ', href: '/contact' },
                { label: 'Chính sách', href: '/policy' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-blue-400 transition-colors duration-300 text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Cột 3: Thông tin liên hệ */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} className="text-white mb-5 font-semibold text-lg">
              Liên hệ
            </Title>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <EnvironmentOutlined className="text-2xl text-blue-400 mt-1 flex-shrink-0" />
                <Text className="text-white leading-relaxed text-base">
                  123 Đường Sơn, Phường 10, Quận 3, TP. Hồ Chí Minh
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <PhoneOutlined className="text-2xl text-blue-400 flex-shrink-0" />
                <Link
                  href="tel:0123456789"
                  className="text-white hover:text-blue-400 transition-colors duration-300 text-base"
                >
                  0123 456 789
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <MailOutlined className="text-2xl text-blue-400 flex-shrink-0" />
                <Link
                  href="mailto:info@vandinh.com"
                  className="text-white hover:text-blue-400 transition-colors duration-300 text-base"
                >
                  info@vandinh.com
                </Link>
              </div>
            </div>
          </Col>

          {/* Cột 4: Mạng xã hội + CTA */}
          <Col xs={24} sm={12} lg={7}>
            <Title level={5} className="text-white mb-5 font-semibold text-lg">
              Theo dõi chúng tôi
            </Title>
            <div className="flex gap-6 mb-8">
              <Link
                href="https://facebook.com/vandinhpaint"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#1877f2] transition-all duration-300 shadow-lg hover:scale-110"
              >
                <FacebookOutlined className="text-3xl text-white" />
              </Link>

              <Link
                href="https://instagram.com/vandinhpaint"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#962fbf] transition-all duration-300 shadow-lg hover:scale-110"
              >
                <InstagramOutlined className="text-3xl text-white" />
              </Link>

              <Link
                href="https://youtube.com/@vandinhpaint"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#ff0000] transition-all duration-300 shadow-lg hover:scale-110"
              >
                <YoutubeOutlined className="text-3xl text-white" />
              </Link>
            </div>
            <Text className="text-white text-base leading-relaxed block">
              Theo dõi để nhận ngay tư vấn màu sắc miễn phí và cập nhật ưu đãi hấp dẫn nhất!
            </Text>
          </Col>
        </Row>

        <Divider className="border-gray-700 my-12" />

        {/* Copyright */}
        <div className="text-center space-y-3">
          <Text className="text-white text-sm">
            © {currentYear}{' '}
            <span className="font-medium">Cửa hàng sơn Vạn Đinh</span>. All rights reserved.
          </Text>
          <Text className="text-gray-400 text-xs">
            Thiết kế & phát triển bởi{' '}
            <span className="text-white">Fong & GDKelvin</span>
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;