import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';

const { Text, Link } = Typography;

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-6">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Text strong className="text-xl mb-2 block">Cửa hàng sơn Vạn Dinh</Text>
          <Text className="text-gray-300">Chuyên cung cấp sơn chất lượng cao cho mọi công trình.</Text>
        </Col>
        <Col xs={24} md={8}>
          <Text strong className="text-lg mb-2 block">Liên hệ</Text>
          <Text className="text-gray-300">Địa chỉ: 123 Đường Sơn, Quận 1, TP.HCM</Text>
          <Text className="text-gray-300 mt-1">Điện thoại: 0123 456 789</Text>
          <Text className="text-gray-300 mt-1">Email: info@vandinh.com</Text>
        </Col>
        <Col xs={24} md={8}>
          <Text strong className="text-lg mb-2 block">Theo dõi</Text>
          <div className="flex gap-2">
            <Link href="#" className="text-gray-300">Facebook</Link>
            <Link href="#" className="text-gray-300">Instagram</Link>
          </div>
        </Col>
      </Row>
      <Divider className="my-4 bg-gray-600" />
      <Text className="text-center text-gray-400 block">
        © 2025 Cửa hàng sơn Vạn Định. All rights reserved.
      </Text>
    </div>
  </footer>
);

export default Footer;