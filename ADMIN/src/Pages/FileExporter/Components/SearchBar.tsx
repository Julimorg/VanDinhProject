import React from 'react';
import { Input, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Card size="small" className="bg-gray-50">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={8}>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm theo tên hoặc email"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            size="large"
            className="w-full"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SearchBar;

