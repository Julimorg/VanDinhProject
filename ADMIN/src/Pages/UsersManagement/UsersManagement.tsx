import React, { useState, useMemo } from 'react';
import { Table, Button, Select, Space, Avatar, Tag, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined } from '@ant-design/icons';
import { useUsers } from './Hook/useGetUsers';
import { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';

const UserManagementView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [pageInfo, setPageInfo] = useState({
    size: 5,
    number: 1,
    totalElements: 0,
    totalPages: 1,
  });

  // Sử dụng hook useUsers để fetch dữ liệu
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
          <Button type="link">Chỉnh sửa</Button>
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
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => window.location.reload()} // Reload để áp dụng filter status
        >
          Lọc
        </Button>
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
            current: pagination.number,
            pageSize: pagination.size,
            total: pagination.totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: (page, pageSize) => {
              setPageInfo(prev => ({ ...prev, number: page, size: pageSize }));
            },
          }}
          className="shadow rounded-lg"
          scroll={{ x: 'max-content' }}
        />
      </Spin>
    </div>
  );
};

export default UserManagementView;