import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Descriptions, 
  Table, 
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
  message 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, EditOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment'; // Giả sử bạn đã cài đặt moment cho DatePicker
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

// Interface cho dữ liệu user (giữ nguyên)
interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string;
  email: string;
  phone: string | null;
  userAddress: string | null;
  userDob: string | null;
  userImg: string | null;
  status: string;
  createAt: string;
  updateAt: string;
}

// Interface cho order (giữ nguyên)
interface Order {
  orderId: string;
  orderCode: string | null;
  shipAddress: string;
  total_quantity: number;
  orderAmount: number;
  orderStatus: string | null;
  paymentMethod: string | null;
  createAt: string | null;
  updateAt: string;
  deletedAt: string;
  completeAt: string;
}

// Dữ liệu mẫu từ response (giữ nguyên)
const initialUserData: UserProfile = {
  id: "9771e8d8-2a04-42bc-b076-33e80d2c9caa",
  firstName: null,
  lastName: null,
  userName: "admin",
  email: "admin@gmail.com",
  phone: null,
  userAddress: null,
  userDob: null,
  userImg: null,
  status: "ACTIVE",
  createAt: "2025-09-17T10:31:06.339823",
  updateAt: "2025-09-17T10:31:06.339823",
};

const ordersData: Order[] = [
  {
    orderId: "467c282a-a1ed-4dde-921e-04d6c6697bc4",
    orderCode: null,
    shipAddress: "Lai Thieu Thuan An Binh Duong",
    total_quantity: 0,
    orderAmount: 0.00,
    orderStatus: null,
    paymentMethod: null,
    createAt: null,
    updateAt: "2025-09-17T15:52:54.213411",
    deletedAt: "2025-09-17T15:52:54.213411",
    completeAt: "2025-09-17T15:52:54.213411"
  },
  {
    orderId: "2f99b7bb-a6a1-4f4c-a5bf-14cc343f7631",
    orderCode: "ORD-20250917-9083",
    shipAddress: "Lai Thieu Thuan An Binh Duong",
    total_quantity: 5,
    orderAmount: 360000.00,
    orderStatus: null,
    paymentMethod: null,
    createAt: "2025-09-17T14:40:11.366219",
    updateAt: "2025-09-17T15:39:42.35619",
    deletedAt: "2025-09-17T15:39:42.35619",
    completeAt: "2025-09-17T15:39:42.35619"
  }
];

const MyProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile>(initialUserData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });

  // Columns cho Table orders (giữ nguyên)
  const columns: ColumnsType<Order> = [
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
      responsive: ['sm'],
    },
    {
      title: 'Số Lượng',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      responsive: ['sm'],
    },
    {
      title: 'Tổng Tiền (VND)',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (value: number) => value.toLocaleString('vi-VN'),
      responsive: ['sm'],
    },
    {
      title: 'Trạng Thái',
      key: 'orderStatus',
      render: (_: any, record: Order) => (
        <Tag color={record.deletedAt ? 'error' : 'default'}>{record.deletedAt ? 'Đã Xóa' : 'Hoàn Thành'}</Tag>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Ngày Cập Nhật',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} size="small">Chi Tiết</Button>
        </Space>
      ),
    },
  ];

  // Responsive layout cho mobile/tablet
  const layout = isTabletOrMobile ? 'vertical' : 'horizontal';

  // Mở modal cập nhật
  const showModal = () => {
    // Khởi tạo form với dữ liệu hiện tại
    form.setFieldsValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      userAddress: userData.userAddress,
      userDob: userData.userDob ? moment(userData.userDob) : null,
    });
    // Khởi tạo fileList cho upload (nếu có ảnh cũ)
    if (userData.userImg) {
      setFileList([{ uid: '-1', name: 'Ảnh cũ', status: 'done', url: userData.userImg }]);
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
    try {
      // Giả lập cập nhật (thay bằng API call thật)
      const updatedUser: UserProfile = {
        ...userData,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        email: values.email,
        phone: values.phone || null,
        userAddress: values.userAddress || null,
        userDob: values.userDob ? values.userDob.format('YYYY-MM-DD') : null,
        userImg: fileList.length > 0 && fileList[0].response ? fileList[0].response.url : (fileList[0]?.url || null),
        updateAt: new Date().toISOString(),
      };
      setUserData(updatedUser);
      message.success('Cập nhật hồ sơ thành công!');
      handleCancel();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý upload ảnh
  const handleUpload = ({ file }: { file: RcFile }) => {
    // Giả lập upload (thay bằng API upload thật)
    const formData = new FormData();
    formData.append('file', file);
    // Simulate API call
    setTimeout(() => {
      file.url = URL.createObjectURL(file); // Preview local
      file.response = { url: file.url }; // Giả lập response
      setFileList([file]);
    }, 1000);
    return false; // Ngăn upload mặc định
  };

  // Cập nhật Avatar với ảnh mới
  const getAvatarUrl = () => userData.userImg || undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Typography.Title level={2} className="text-center mb-8 text-gray-800">
          Hồ Sơ Cá Nhân - Admin
        </Typography.Title>

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
                {userData.firstName || userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.userName}
              </Typography.Text>
              <Tag color="green" className="mt-2">{userData.status}</Tag>
            </Col>
            <Col xs={24} sm={16}>
              <Descriptions 
                layout={layout as any}
                bordered 
                column={isTabletOrMobile ? 1 : 2}
                className="text-sm"
              >
                <Descriptions.Item label="Tên Đăng Nhập">
                  {userData.userName}
                </Descriptions.Item>
                <Descriptions.Item label="Họ Tên">
                  {userData.firstName || userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {userData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">
                  {userData.phone || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ">
                  {userData.userAddress || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Sinh">
                  {userData.userDob ? new Date(userData.userDob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Tạo">
                  {new Date(userData.createAt).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Cập Nhật Cuối">
                  {new Date(userData.updateAt).toLocaleDateString('vi-VN')}
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

        {/* Orders Table (giữ nguyên) */}
        <Card className="shadow-lg rounded-lg" title="Lịch Sử Đơn Hàng">
          <Table 
            columns={columns} 
            dataSource={ordersData} 
            rowKey="orderId"
            pagination={{ 
              pageSize: isTabletOrMobile ? 5 : 10,
              showSizeChanger: false,
              showQuickJumper: true 
            }}
            scroll={{ x: isTabletOrMobile ? 800 : 'max-content' }}
            className="overflow-x-auto"
          />
        </Card>
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
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            userAddress: userData.userAddress,
            userDob: userData.userDob ? moment(userData.userDob) : null,
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