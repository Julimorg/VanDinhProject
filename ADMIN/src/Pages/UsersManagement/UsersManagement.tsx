
import React, { useState, useMemo } from 'react';
import { Table, Button, Select, Space, Avatar, Tag, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useUsers } from './Hook/useGetUsers';
import { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';
import UserUpdateModal from './Components/UserUpdateModal'; 
import UserCreateModal from './Components/CreateUserModal';

const UserManagementView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [pageInfo, setPageInfo] = useState({
    size: 5,
    number: 0, // Bắt đầu từ 0 cho API (0-based)
    totalElements: 0,
    totalPages: 1,
  });

  // State cho modal tạo mới
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  // State cho modal cập nhật/xem
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUsersResponse | null>(null);
  const [isViewMode, setIsViewMode] = useState<boolean>(false); // Để phân biệt xem chi tiết (read-only)

  // Sử dụng hook useUsers để fetch dữ liệu (page 0-based)
  const { data, isLoading, error } = useUsers({
    status: statusFilter,
    page: pageInfo.number,
    size: pageInfo.size,
  });

  // Debug: Log data để kiểm tra response API (xóa sau khi debug xong)
  console.log('Debug data from API:', data);

  // Memoize users để tránh tạo mới mỗi render, và an toàn với optional chaining
  const users = useMemo(() => data?.data?.content || [], [data]);

  // Memoize pagination để tránh tạo mới mỗi render, và an toàn với optional chaining
  const pagination = useMemo(() => data?.data?.page || pageInfo, [data, pageInfo]);

  // Lọc theo vai trò (client-side, vì API không hỗ trợ filter role)
  const filteredUsers = useMemo(
    () =>
      users.filter(user =>
        roleFilter === 'all' ? true : user.roles.some(role => role.name === roleFilter)
      ),
    [users, roleFilter]
  );

  // Hàm mở modal tạo mới
  const handleCreateUser = () => {
    setCreateModalVisible(true);
  };

  // Hàm mở modal chỉnh sửa
  const handleUpdateUser = (user: IUsersResponse) => {
    setIsViewMode(false);
    setSelectedUser(user);
    setUpdateModalVisible(true);
  };

  // Hàm mở modal xem chi tiết (read-only)
  const handleViewUser = (user: IUsersResponse) => {
    setIsViewMode(true);
    setSelectedUser(user);
    setUpdateModalVisible(true);
  };

  // Cấu hình cột cho Table
  const columns: ColumnsType<IUsersResponse> = [
    {
      title: 'Avatar',
      dataIndex: 'userImg',
      key: 'userImg',
      render: (userImg: string) => (
        <Avatar src={userImg} size={40}>
          {!userImg && 'N/A'}
        </Avatar>
      ),
      width: 80,
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
          {roles.map(role => (
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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (createAt: string) => new Date(createAt).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      responsive: ['lg'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[],
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewUser(record)}
            title="Xem chi tiết"
          >
            Xem
          </Button>
          <Button 
            type="link" 
            onClick={() => handleUpdateUser(record)}
            title="Chỉnh sửa"
          >
            Chỉnh sửa
          </Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý người dùng</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value: string) => setStatusFilter(value)}
            className="w-full sm:w-40"
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
          </Select>
          <Select
            placeholder="Lọc theo vai trò"
            value={roleFilter}
            onChange={(value: string) => setRoleFilter(value)}
            className="w-full sm:w-40"
          >
            <Select.Option value="all">Tất cả vai trò</Select.Option>
            <Select.Option value="USER">Người dùng</Select.Option>
            <Select.Option value="STAFF">Nhân viên</Select.Option>
            <Select.Option value="ADMIN">Quản trị viên</Select.Option>
          </Select>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => window.location.reload()} // Reload để áp dụng filter status
          >
            Lọc
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateUser}
          >
            Thêm mới
          </Button>
        </Space>
      </div>

      {/* {error && (
        <div className="mb-4 text-red-500 text-center">Không thể tải danh sách người dùng</div>
      )} */}

      {/* Table Section */}
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            current: pagination.number + 1, // Hiển thị 1-based cho UI (AntD)
            pageSize: pagination.size,
            total: pagination.totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (page, pageSize) => {
              setPageInfo(prev => ({ 
                ...prev, 
                number: page - 1, // Chuyển về 0-based cho API
                size: pageSize 
              }));
            },
          }}
          className="shadow rounded-lg"
          scroll={{ x: 'max-content' }}
        />
      </Spin>

      {/* Modal tạo mới User (tách riêng) */}
      <UserCreateModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
      />

      {/* Modal cập nhật/xem User (tách riêng) */}
      <UserUpdateModal
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        user={selectedUser}
        isViewMode={isViewMode}
      />
    </div>
  );
};

export default UserManagementView;