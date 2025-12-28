import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Tag,
  Spin,
  message,
  Divider,
  Badge,
} from 'antd';
import { SendOutlined, UserOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { useGetUserOnlineStatus } from './Hook/useGetUserOnline';
import { useSendNotifications } from './Hook/useSendNotifications';
import { useDebounce } from '@/Hook/useDebounce';
import { IGetUserOnlineStatus } from '@/Interface/Notification/IGetUserOnlineStatus';
import { ISendNotificationsRequest } from '@/Interface/Notification/ISendNotifications';
import { useOnlineStatusStore } from '@/Store/useOnlineStatusStore';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SendNotificationPage: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useAuthStore((state) => state.id) ?? '';
  const userName = useAuthStore((state) => state.userName) ?? '';

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter] = useState<string>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onlineUsers = useOnlineStatusStore((state) => state.onlineUsers);
  const isUserOnline = useOnlineStatusStore((state) => state.isUserOnline);

  const [pageInfo, setPageInfo] = useState({
    size: 10,
    number: 0,
  });

  //? Fetch User Status Online Data
  const { data, isLoading } = useGetUserOnlineStatus({
    page: pageInfo.number,
    size: pageInfo.size,
    sort: 'userName,asc',
  });

  //? Merge Data From UserStatusOnline Data với WebSocket RealTime Message bằng Map
  const users: IGetUserOnlineStatus[] = useMemo(() => {
    const apiUsers = (data?.data?.content || []) as IGetUserOnlineStatus[];

    //? Gộp data từ API với realtime data từ Store
    return apiUsers.map((user) => {
      const realtimeStatus = onlineUsers.get(user.userId);

      if (realtimeStatus) {
        return {
          ...user,
          socketId: realtimeStatus.socketId,
          lastSeen: realtimeStatus.lastSeen,
        };
      }

      return user;
    });
  }, [data, onlineUsers]);

  //? Đếm UserOnline
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setPageInfo((prev) => ({ ...prev, number: 0 }));
  }, [statusFilter, debouncedSearch]);

  const pagination = useMemo(
    () =>
      data?.data?.page || {
        number: pageInfo.number,
        size: pageInfo.size,
        totalElements: 0,
        totalPages: 1,
      },
    [data, pageInfo]
  );

  const { mutate: sendNotifications, isPending: isSending } = useSendNotifications({
    onSuccess: () => {
      toast.success(`Đã gửi thông báo thành công cho ${selectedUserIds.length} người dùng!`);
      form.resetFields();
      setSelectedUserIds([]);
      setSelectedRowKeys([]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gửi thông báo thất bại. Vui lòng thử lại!');
    },
  });

  // Handle form submit
  const handleSubmit = (values: any) => {
    if (selectedUserIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một người dùng!');
      return;
    }

    const request: ISendNotificationsRequest = {
      userId: selectedUserIds,
      title: values.title,
      message: values.message,
      type: values.type,
      createBy: userName || userId,
    };

    sendNotifications(request);
  };

  useEffect(() => {
    const currentPageIds = users.map((user) => user.userId);
    const selectedInCurrentPage = selectedUserIds.filter((id) => currentPageIds.includes(id));
    setSelectedRowKeys(selectedInCurrentPage);
  }, [users, selectedUserIds]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedRows: IGetUserOnlineStatus[]) => {
      const selectedIds = selectedRows.map((row) => row.userId);
      const currentPageIds = users.map((user) => user.userId);
      const otherPageIds = selectedUserIds.filter((id) => !currentPageIds.includes(id));
      setSelectedUserIds([...otherPageIds, ...selectedIds]);
    },
  };

  // Columns với online status indicator
  const columns = [
    {
      title: 'Avatar',
      key: 'avatar',
      render: (_: any, record: IGetUserOnlineStatus) => {
        const online = record.socketId !== null && record.socketId !== undefined;
        return (
          <Badge dot status={online ? 'success' : 'default'} offset={[-5, 35]}>
            <Avatar src={record.userImg} icon={<UserOutlined />} size={40} />
          </Badge>
        );
      },
    },
    {
      title: 'Tên',
      dataIndex: 'userName',
      key: 'userName',
      render: (name: string, record: IGetUserOnlineStatus) => {
        const online = record.socketId !== null && record.socketId !== undefined;

        return (
          <div className="flex items-center gap-2">
            <span>{name}</span>
            {online && <Tag color="green">Online</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: IGetUserOnlineStatus) => {
        const online = record.socketId !== null && record.socketId !== undefined;

        return (
          <Tag color={record.socketId ? 'green' : 'default'}>
            {online ? '🟢 Online' : '⚪ Offline'}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <Title level={2} className="text-gray-900 mb-2 text-xl sm:text-2xl">
              Gửi Thông Báo
            </Title>
            <Text type="secondary" className="block text-sm">
              Chọn người dùng và điền thông tin để gửi thông báo
            </Text>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {/* Form Section - Left Side */}
          <Col xs={24} lg={10}>
            <Card
              className="shadow-sm border-0 bg-white rounded-xl mb-4 sm:mb-0"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="mb-4">
                <Title level={4} className="mb-1">
                  Thông tin thông báo
                </Title>
                <Text type="secondary" className="text-sm">
                  Điền đầy đủ thông tin để gửi thông báo
                </Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề!' },
                    { max: 200, message: 'Tiêu đề không được quá 200 ký tự!' },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề thông báo" size="large" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="message"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung!' },
                    { max: 1000, message: 'Nội dung không được quá 1000 ký tự!' },
                  ]}
                >
                  <TextArea
                    placeholder="Nhập nội dung thông báo"
                    rows={6}
                    showCount
                    maxLength={1000}
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label="Loại thông báo"
                  name="type"
                  rules={[{ required: true, message: 'Vui lòng chọn loại thông báo!' }]}
                >
                  <Select placeholder="Chọn loại thông báo" size="large" className="rounded-lg">
                    <Option value="SYSTEM">Hệ thống</Option>
                    <Option value="ORDER">Đơn hàng</Option>
                    <Option value="PRODUCT">Sản phẩm</Option>
                    <Option value="WARNING">Cảnh báo</Option>
                    <Option value="ERROR">Lỗi</Option>
                    <Option value="SUCCESS">Thành công</Option>
                  </Select>
                </Form.Item>

                <Divider />

                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleOutlined className="text-blue-600" />
                    <Text strong className="text-blue-900">
                      Đã chọn: {selectedUserIds.length} người dùng
                    </Text>
                  </div>
                  {selectedUserIds.length > 0 && (
                    <Text type="secondary" className="text-xs block">
                      Thông báo sẽ được gửi đến {selectedUserIds.length} người dùng đã chọn
                    </Text>
                  )}
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    size="large"
                    loading={isSending}
                    disabled={selectedUserIds.length === 0}
                    className="w-full sm:w-auto rounded-lg"
                    block
                  >
                    {isSending ? 'Đang gửi...' : 'Gửi thông báo'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Table Section - Right Side */}
          <Col xs={24} lg={14}>
            <Card
              className="shadow-sm border-0 bg-white rounded-xl"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="mb-4">
                <Title level={4} className="mb-1">
                  Danh sách người dùng
                </Title>
                <Space>
                  <Text type="secondary" className="text-sm">
                    Tổng số: {pagination.totalElements} người dùng
                  </Text>
                  <Tag color="green">
                    {users.filter((u) => u.socketId !== null && u.socketId !== undefined).length}{' '}
                    Online
                  </Tag>
                </Space>
              </div>

              {/* Search và Filter */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="flex-1 rounded-lg"
                  size="large"
                />
              </div>

              {/* Table */}
              <Spin spinning={isLoading}>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={users}
                  rowKey="userId"
                  pagination={{
                    current: pagination.number + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Tổng ${total} người dùng`,
                    onChange: (page, pageSize) => {
                      setPageInfo({ number: page - 1, size: pageSize });
                    },
                  }}
                  scroll={{ x: 'max-content' }}
                  className="rounded-lg"
                  size="middle"
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SendNotificationPage;
