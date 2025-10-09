import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Descriptions, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Spin,  
} from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useAuthStore } from '@/Store/IAuth';
import { useGetMyProfile } from './Hook/useGetMyProfile';
import { formatToVietnamTime } from '@/Utils/ulti';
import UpdateProfileModal from './Components/UpdateProfileModal';

const MyProfile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  const id = useAuthStore.getState().id;

  const { data, isLoading } = useGetMyProfile(id ?? '');

  const layout = isTabletOrMobile ? 'vertical' : 'horizontal';

  // Hàm mở modal và truyền data
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal và reset loading
  const handleCancel = () => {
    setIsModalVisible(false);
    setLoading(false);
  };

  // Hàm xử lý update thành công từ modal (callback)
  const handleUpdateSuccess = () => {
    setLoading(false);
    handleCancel();
    // Có thể refetch data nếu cần (sử dụng mutate từ hook nếu có)
  };

  // Avatar URL
  const getAvatarUrl = () => data?.data.userImg || undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Typography.Title level={2} className="text-center mb-8 text-gray-800">
          Hồ Sơ Cá Nhân - Admin
        </Typography.Title>
        <Spin spinning={isLoading}>
          {/* Profile Card */}
          <Card className="mb-8 shadow-lg rounded-lg" title="Thông Tin Cá Nhân">
            <Row gutter={24} justify="center">
              <Col xs={24} sm={8} className="text-center">
                <Avatar 
                  size={isTabletOrMobile ? 80 : 120} 
                  src={getAvatarUrl()}
                  icon={<UserOutlined />} 
                  className="mx-auto mb-4"
                  style={{ backgroundColor: '#1890ff' }}
                />
                <Typography.Text className="block text-lg font-semibold">
                  {data?.data.firstName || data?.data.lastName ? `${data?.data.firstName} ${data?.data.lastName}` : data?.data.userName}
                </Typography.Text>
                <Tag color="green" className="mt-2">{data?.data.status}</Tag>
              </Col>
              <Col xs={24} sm={16}>
                <Descriptions 
                  layout={layout as any}
                  bordered 
                  column={isTabletOrMobile ? 1 : 2}
                  className="text-sm"
                >
                  <Descriptions.Item label="Tên Đăng Nhập">
                    {data?.data.userName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Họ Tên">
                    {data?.data.firstName || data?.data.lastName ? `${data?.data.firstName} ${data?.data.lastName}` : 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {data?.data.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số Điện Thoại">
                    {data?.data.phone || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa Chỉ">
                    {data?.data.userAddress || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày Sinh">
                    {data?.data.userDob ? new Date(data?.data.userDob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày Tạo">
                    {formatToVietnamTime(data?.data.createAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày Cập Nhật Cuối">
                    {formatToVietnamTime(data?.data.updateAt)}
                  </Descriptions.Item>
                </Descriptions>
                <div className="mt-4 text-center sm:text-right">
                  <Button type="primary" icon={<EditOutlined />} size={isTabletOrMobile ? 'middle' : 'large'} onClick={showModal}>
                    Cập Nhật Hồ Sơ
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Spin>
      </div>

      <UpdateProfileModal
        visible={isModalVisible}
        onCancel={handleCancel}
        initialData={data?.data}
        onUpdateSuccess={handleUpdateSuccess}
        loading={loading}
        isTabletOrMobile={isTabletOrMobile}
      />
    </div>
  );
};

export default MyProfile;