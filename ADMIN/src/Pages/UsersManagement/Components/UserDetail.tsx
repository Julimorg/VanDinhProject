// src/pages/Users/UserDetailView.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Avatar,
  Tag,
  Image,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
  Button,
  Alert,
} from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd/es/descriptions';
import { useGetUserDetail } from '../Hook/useGetUserDetail';
import { IGetUserDetailResponse } from '@/Interface/Users/IGetUserDetail';
import UserOrderHistory from './UserOrderDetailTable';

const { Title, Text } = Typography;

const UserDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();

  const { data: userResponse, isLoading, error } = useGetUserDetail(userId);

  // Loading
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin người dùng..." />
      </div>
    );
  }

  // Error
  if (error || !userResponse?.data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải thông tin người dùng. Vui lòng thử lại sau."
          type="error"
          showIcon
          action={
            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')}>
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  const user: IGetUserDetailResponse = userResponse.data;

  const descriptionItems: DescriptionsProps['items'] = [
    { key: '1', label: 'Họ tên', children: `${user.firstName} ${user.lastName}`, span: 2 },
    { key: '2', label: 'Tên đăng nhập', children: user.userName, span: 2 },
    { key: '3', label: 'Email', children: user.email, span: 2 },
    { key: '4', label: 'Số điện thoại', children: user.phone || '—', span: 2 },
    { key: '5', label: 'Địa chỉ', children: user.userAddress || '—', span: 2 },
    {
      key: '6',
      label: 'Ngày sinh',
      children: user.userDob ? new Date(user.userDob).toLocaleDateString('vi-VN') : '—',
      span: 2,
    },
    {
      key: '7',
      label: 'Trạng thái',
      children: (
        <Tag color={user.status === 'ACTIVE' ? 'green' : 'red'}>{user.status}</Tag>
      ),
      span: 2,
    },
    {
      key: '8',
      label: 'Tạo lúc',
      children: new Date(user.creatAt).toLocaleDateString('vi-VN'),
      span: 2,
    },
    {
      key: '9',
      label: 'Cập nhật lúc',
      children: new Date(user.updateAt).toLocaleDateString('vi-VN'),
      span: 2,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Row gutter={[16, 24]} align="middle" className="mb-8">
        <Col xs={24} sm={4} md={3} lg={2}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/users')}
            size="large"
          >
            Quay lại
          </Button>
        </Col>
        <Col xs={24} sm={6} md={5}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={user.userImg}
            className="block mx-auto"
          >
            {user.userImg && <Image src={user.userImg} preview={false} />}
          </Avatar>
        </Col>
        <Col xs={24} sm={14} md={16}>
          <Title level={2} className="m-0 text-center sm:text-left">
            {user.firstName} {user.lastName}
          </Title>
          <Text type="secondary" className="block text-center sm:text-left">
            ID: {user.id} • {user.roles.map(r => r.name).join(', ')}
          </Text>
        </Col>
      </Row>

      {/* Thông tin người dùng */}
      <Row gutter={24} className="mb-8">
        <Col xs={24}>
          <Card title="Thông Tin Cá Nhân">
            <Descriptions
              bordered
              items={descriptionItems}
              column={{ xs: 1, sm: 2, md: 3 }}
              layout="vertical"
            />

            <Divider orientation="left">Vai trò & Quyền</Divider>
            <Row gutter={[16, 16]}>
              {user.roles.map((role) => (
                <Col xs={24} sm={12} md={8} lg={6} key={role.name}>
                  <Card hoverable size="small" className="text-center">
                    <Title level={5} className="m-0">{role.name}</Title>
                    <Text type="secondary" className="text-xs">{role.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Lịch sử giao dịch - Component riêng */}
      <Row gutter={24}>
        <Col xs={24}>
          <UserOrderHistory userId={user.id} />
        </Col>
      </Row>

      <Divider />
      <Text type="secondary" className="block text-center">
        Hệ thống E-commerce Admin • Responsive với Ant Design & Tailwind
      </Text>
    </div>
  );
};

export default UserDetailView;