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
  Space, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  DatePicker,
  Spin,  
} from 'antd';
import { UserOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useAuthStore } from '@/Store/IAuth';
import { useGetMyProfile } from './Hook/useGetMyProfile';
import { formatToVietnamTime } from '@/Utils/ulti';

const MyProfile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  const id = useAuthStore.getState().id;

  const { data , isLoading} = useGetMyProfile(id ?? '');

  const layout = isTabletOrMobile ? 'vertical' : 'horizontal';

  // Mở modal cập nhật
  const showModal = () => {
   
    form.setFieldsValue({
      firstName: data?.data.firstName,
      lastName: data?.data.lastName,
      email: data?.data.email,
      phone: data?.data.phone,
      userAddress: data?.data.userAddress,
      userDob: data?.data.userDob ,
    });
    // Khởi tạo fileList cho upload (nếu có ảnh cũ)
    if (data?.data.userImg) {
      setFileList([{ uid: '-1', name: 'Ảnh cũ', status: 'done', url: data?.data.userImg }]);
    } else {
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  // Xử lý submit form cập nhật
  const handleUpdate = async (values: any) => {
    setLoading(true);
    // try {
    //   // Giả lập cập nhật (thay bằng API call thật)
    //   const updatedUser: UserProfile = {
    //     ...userData,
    //     firstName: values.firstName || null,
    //     lastName: values.lastName || null,
    //     email: values.email,
    //     phone: values.phone || null,
    //     userAddress: values.userAddress || null,
    //     userDob: values.userDob ? values.userDob.format('YYYY-MM-DD') : null,
    //     userImg: fileList.length > 0 && fileList[0].response ? fileList[0].response.url : (fileList[0]?.url || null),
    //     updateAt: new Date().toISOString(),
    //   };
    //   setUserData(updatedUser);
    //   message.success('Cập nhật hồ sơ thành công!');
    //   handleCancel();
    // } catch (error) {
    //   message.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    // } finally {
    //   setLoading(false);
    // }
  };

  //? Xử lý upload ảnh
  const handleUpload = ({ file }: { file: RcFile }) => {
    // Giả lập upload (thay bằng API upload thật)
    const formData = new FormData();
    formData.append('file', file);
    // Simulate API call
    setTimeout(() => {
      file.url = URL.createObjectURL(file); 
      file.response = { url: file.url }; 
      setFileList([file]);
    }, 1000);
    return false; 
  };

  // Cập nhật Avatar với ảnh mới
  const getAvatarUrl = () => data?.data.userImg || undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Typography.Title level={2} className="text-center mb-8 text-gray-800">
          Hồ Sơ Cá Nhân - Admin
        </Typography.Title>
        <Spin spinning = {isLoading}>
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

      {/* Modal Cập Nhật Hồ Sơ */}
      <Modal 
        title="Cập Nhật Thông Tin Cá Nhân" 
        visible={isModalVisible} 
        onCancel={handleCancel}
        footer={null}
        width={isTabletOrMobile ? '90%' : 600}
        centered
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleUpdate} 
          initialValues={{
            firstName: data?.data.firstName,
            lastName: data?.data.lastName,
            email: data?.data.email,
            phone: data?.data.phone,
            userAddress: data?.data.userAddress,
            userDob: data?.data.userDob ,
          }}
        >
          <Form.Item 
            name="firstName" 
            label="Họ" 
            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
          >
            <Input placeholder="Nhập họ" />
          </Form.Item>

          <Form.Item 
            name="lastName" 
            label="Tên" 
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="Email" 
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Nhập email" disabled />
          </Form.Item>

          <Form.Item name="phone" label="Số Điện Thoại">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="userAddress" label="Địa Chỉ">
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item name="userDob" label="Ngày Sinh">
            <DatePicker 
              format="DD/MM/YYYY" 
              style={{ width: '100%' }} 
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item label="Ảnh Đại Diện">
            <Upload 
              name="avatar"
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              customRequest={handleUpload}
              maxCount={1}
              beforeUpload={() => false}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div className="mt-2">Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="text-center">
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<EditOutlined />}>
                Cập Nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyProfile;