import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Descriptions, Table, Avatar, Tag, Image, Row, Col, Divider, Typography, Spin, Button, Alert } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd/es/descriptions';
import type { ColumnsType } from 'antd/es/table';
import type { IGetUserDetailResponse, UsersRole, UserOrders } from '@/Interface/Users/IGetUserDetail'; 
import { useGetUserDetail } from '../Hook/useGetUserDetail';

const { Title, Text } = Typography;

type Order = UserOrders;


const UserDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();

  const { data: userResponse, isLoading, error } = useGetUserDetail(userId);

  console.log(userResponse);
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin người dùng..." />
      </div>
    );
  }

  if (error || !userResponse?.data) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải thông tin người dùng. Vui lòng thử lại."
          type="error"
          showIcon
          action={
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/users')} 
            >
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  // Lấy user data từ response
  const user: IGetUserDetailResponse = userResponse.data;

  // Cấu hình columns cho Table Orders (dựa trên UserOrders, responsive với Ant Design) - Thêm đầy đủ trường
  const orderColumns: ColumnsType<Order> = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      responsive: ['sm'], 
    },
    {
      title: 'Địa Chỉ Giao',
      dataIndex: 'shipAddress',
      key: 'shipAddress',
      ellipsis: true,
      responsive: ['md'], 
    },
    {
      title: 'Số Tiền',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (amount: number) => (
        <Text strong>{amount.toLocaleString('vi-VN')} VNĐ</Text>
      ),
      responsive: ['xs'], 
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'canceled' ? 'red' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      ),
      responsive: ['xs'],
    },
    {
      title: 'Phương Thức Thanh Toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      responsive: ['sm'],
    },
    {
      title: 'Tạo Bởi',
      dataIndex: 'createBy',
      key: 'createBy',
      responsive: ['md'],
    },
    {
      title: 'Phê Duyệt Bởi',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      responsive: ['lg'], // Chỉ hiển thị trên màn hình lớn
    },
    {
      title: 'Hủy Bởi',
      dataIndex: 'canceledBy',
      key: 'canceledBy',
      responsive: ['lg'], // Chỉ hiển thị trên màn hình lớn
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      responsive: ['xs'],
    },
    {
      title: 'Cập Nhật',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      responsive: ['sm'],
    },
    {
      title: 'Hoàn Thành',
      dataIndex: 'compeletAt',
      key: 'compeletAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa hoàn thành',
      responsive: ['md'],
    },
    {
      title: 'Xóa Tại',
      dataIndex: 'deleteAt',
      key: 'deleteAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
      responsive: ['md'],
    },
  ];


  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Họ Tên',
      children: `${user.firstName} ${user.lastName}`,
      span: 2,
    },
    {
      key: '2',
      label: 'Tên Đăng Nhập',
      children: user.userName,
      span: 2,
    },
    {
      key: '3',
      label: 'Email',
      children: user.email,
      span: 2,
    },
    {
      key: '4',
      label: 'Số Điện Thoại',
      children: user.phone,
      span: 2,
    },
    {
      key: '5',
      label: 'Địa Chỉ',
      children: user.userAddress,
      span: 2,
    },
    {
      key: '6',
      label: 'Ngày Sinh',
      children: new Date(user.userDob).toLocaleDateString('vi-VN'),
      span: 2,
    },
    {
      key: '7',
      label: 'Trạng Thái',
      children: <Tag color={user.status === 'ACTIVE' ? 'green' : 'INACTIVE' ? 'red' : 'default'}>{user.status}</Tag>, 
      span: 2,
    },
    {
      key: '8',
      label: 'Tạo Tại',
      children: new Date(user.creatAt).toLocaleDateString('vi-VN'), 
      span: 2,
    },
    {
      key: '9',
      label: 'Cập Nhật Tại',
      children: new Date(user.updateAt).toLocaleDateString('vi-VN'),
      span: 2,
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header với Avatar và Title - Responsive, thêm back button */}
      <Row gutter={[16, 16]} align="middle" className="mb-6">
        <Col xs={24} sm={2} md={2}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/users')} // Quay về trang quản lý users
            className="mb-2"
          >
            Quay lại
          </Button>
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={user.userImg}
            className="mx-auto md:mx-0"
          >
            {user.userImg ? <Image src={user.userImg} preview={false} /> : null}
          </Avatar>
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Title level={2} className="m-0 text-center md:text-left">
            Chi Tiết Người Dùng: {user.firstName} {user.lastName}
          </Title>
          <Text type="secondary" className="block text-center md:text-left">
            ID: {user.id}
          </Text>
        </Col>
      </Row>

      <Row gutter={24} className="mb-6">
        <Col xs={24}>
          <Card title="Thông Tin Người Dùng" className="h-full">
            <Descriptions
              bordered
              items={descriptionItems}
              column={{ xs: 1, sm: 2 }} 
              layout="vertical"
              className="responsive-descriptions mb-4" 
            />
        
            <div className="mt-4">
              <Title level={5} className="mb-3">Vai Trò</Title>
              <Row gutter={[16, 16]}>
                {user.roles.map((role: UsersRole, index: number) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card
                      hoverable
                      className="text-center"
                      bodyStyle={{ padding: '12px' }} 
                    >
                      <Title level={5} className="m-0 mb-1">{role.name}</Title>
                      <Text type="secondary" className="block text-xs">{role.description}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Phần Lịch sử giao dịch - Full width, không gian lớn hơn ở dưới */}
      <Row gutter={24}>
        <Col xs={24}>
          <Card title="Lịch sử giao dịch" className="mb-6">
            <Table
              columns={orderColumns}
              dataSource={user.orders as Order[]} // Cast sang Order type cho Table
              pagination={{ 
                pageSize: 10, // Tăng pageSize để hiển thị nhiều hơn
                showSizeChanger: true, // Cho phép thay đổi size
                showQuickJumper: true // Quick jumper cho large data
              }}
              scroll={{ 
                x: 1200, // Tăng x scroll để chứa thêm columns mới
                y: 400 // Thêm scroll y để table cao hơn, không gian lớn hơn
              }}
              size="middle" // Tăng size từ small để lớn hơn
              rowKey="orderId"
            />
          </Card>
        </Col>
      </Row>

      <Divider />
      <Text type="secondary" className="text-center block">
        Hệ thống E-commerce Admin - Thiết kế responsive với Tailwind & Ant Design
      </Text>
    </div>
  );
};

export default UserDetailView;