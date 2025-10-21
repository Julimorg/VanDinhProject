import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Image, Spin, Row, Col, Button, Grid, Space, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { useGetCategoryDetail } from '../Hook/useGetCategoryDetail';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const { data, isLoading, error } = useGetCategoryDetail(categoryId);

  const category = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Đang tải chi tiết danh mục..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Text type="danger">Không thể tải chi tiết danh mục. Vui lòng thử lại sau.</Text>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Text type="secondary">Không tìm thấy danh mục.</Text>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card
        className="max-w-5xl mx-auto shadow-lg border border-gray-200"
        bodyStyle={{ padding: screens.xs ? 16 : 32 }}
      >
        {/* Nút quay lại */}
        <div className="flex items-center mb-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>

        {/* Ảnh + Thông tin */}
        <Row gutter={[24, 24]} align="middle">
          {/* Ảnh bên trái */}
          <Col xs={24} sm={24} md={10} lg={8}>
            <div className="flex justify-center">
              <Image
                src={category.categoryImage}
                alt={category.categoryName}
                width={screens.xs ? 200 : 260}
                height={screens.xs ? 200 : 260}
                className="rounded-xl object-cover shadow-md"
                preview
              />
            </div>
          </Col>

          {/* Thông tin bên phải */}
          <Col xs={24} sm={24} md={14} lg={16}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Title
                level={screens.xs ? 4 : 2}
                className="text-blue-600 m-0 leading-tight"
              >
                {category.categoryName}
              </Title>
              <Paragraph
                className="text-gray-600"
                style={{ fontSize: screens.xs ? 14 : 16 }}
              >
                {category.categoryDescription || 'Không có mô tả.'}
              </Paragraph>

              <Divider />

              <Space
                direction="vertical"
                size={screens.xs ? 4 : 8}
                style={{ width: '100%' }}
              >
                <Text strong>ID: </Text>
                <Text copyable>{category.categoryId}</Text>

                <Text strong>
                  <CalendarOutlined /> Ngày tạo:
                </Text>
                <Text>
                  {new Date(category.createAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>

                <Text strong>
                  <CalendarOutlined /> Cập nhật:
                </Text>
                <Text>
                  {new Date(category.updateAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CategoryDetail;
