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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SendOutlined,
  UserOutlined,
  SearchOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/Store/IAuth';
import { useUsers } from '@/Pages/UsersManagement/Hook/useGetUsers';
import { useSendNotifications } from './Hook/useSendNotifications';
import { useDebounce } from '@/Hook/useDebounce';
import { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';
import { ISendNotificationsRequest } from '@/Interface/Notification/ISendNotifications';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SendNotificationPage: React.FC = () => {
  const [form] = Form.useForm();
  const userId = useAuthStore((state) => state.id) ?? '';
  const userName = useAuthStore((state) => state.userName) ?? '';

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageInfo, setPageInfo] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setPageInfo(prev => ({ ...prev, number: 0 }));
  }, [statusFilter, debouncedSearch]);


  const { data, isLoading } = useUsers({
    status: statusFilter,
    page: pageInfo.number,
    size: pageInfo.size,
    search: debouncedSearch,
  });

  const users: IUsersResponse[] = useMemo(
    () => (data?.data?.content || []) as IUsersResponse[],
    [data]
  );

  const pagination = useMemo(
    () => data?.data?.page || pageInfo,
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

  // Sync selectedRowKeys với selectedUserIds khi users thay đổi
  useEffect(() => {
    const currentPageIds = users.map((user) => user.id);
    const selectedInCurrentPage = selectedUserIds.filter((id) =>
      currentPageIds.includes(id)
    );
    setSelectedRowKeys(selectedInCurrentPage);
  }, [users, selectedUserIds]);

  // Handle row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedRows: IUsersResponse[]) => {
      const selectedIds = selectedRows.map((row) => row.id);
      const currentPageIds = users.map((user) => user.id);
      
      // Lấy các IDs đã chọn ở các trang khác
      const otherPageIds = selectedUserIds.filter(
        (id) => !currentPageIds.includes(id)
      );
      
      // Kết hợp với selection của trang hiện tại
      setSelectedUserIds([...otherPageIds, ...selectedIds]);
    },
    onSelectAll: (selected: boolean, selectedRows: IUsersResponse[], changeRows: IUsersResponse[]) => {
      const currentPageIds = users.map((user) => user.id);
      const otherPageIds = selectedUserIds.filter(
        (id) => !currentPageIds.includes(id)
      );
      
      if (selected) {
        const newIds = changeRows.map((row) => row.id);
        setSelectedUserIds([...otherPageIds, ...newIds]);
      } else {
        setSelectedUserIds(otherPageIds);
      }
    },
  };

  // Columns cho table
  const columns: ColumnsType<IUsersResponse> = [
    {
      title: 'Avatar',
      dataIndex: 'userImg',
      key: 'userImg',
      width: 80,
      render: (userImg: string) => (
        <Avatar src={userImg} icon={<UserOutlined />} size={40} />
      ),
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      responsive: ['md'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[],
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: UserRoles[]) => (
        <Space>
          {roles.map((role) => (
            <Tag
              key={role.name}
              color={
                role.name === 'ADMIN' ? 'red' : role.name === 'STAFF' ? 'blue' : 'green'
              }
            >
              {role.name}
            </Tag>
          ))}
        </Space>
      ),
      responsive: ['lg'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Title level={2} className="text-center sm:text-left text-gray-900 mb-2 text-xl sm:text-2xl">
            Gửi Thông Báo
          </Title>
          <Text type="secondary" className="block text-sm text-center sm:text-left">
            Chọn người dùng và điền thông tin để gửi thông báo
          </Text>
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

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="w-full"
              >
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề!' },
                    { max: 200, message: 'Tiêu đề không được quá 200 ký tự!' },
                  ]}
                >
                  <Input
                    placeholder="Nhập tiêu đề thông báo"
                    size="large"
                    className="rounded-lg"
                  />
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
                  <Select
                    placeholder="Chọn loại thông báo"
                    size="large"
                    className="rounded-lg"
                  >
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
                <Text type="secondary" className="text-sm">
                  Tổng số: {pagination.totalElements} người dùng
                </Text>
              </div>

              {/* Search và Filter */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="flex-1 rounded-lg"
                  size="large"
                />
                <Select
                  placeholder="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={(value: string) => setStatusFilter(value)}
                  className="w-full sm:w-48 rounded-lg"
                  size="large"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                </Select>
              </div>

              {/* Table */}
              <Spin spinning={isLoading}>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  pagination={{
                    current: pagination.number + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Tổng ${total} người dùng`,
                    onChange: (page, pageSize) => {
                      setPageInfo((prev) => ({
                        ...prev,
                        number: page - 1,
                        size: pageSize,
                      }));
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
