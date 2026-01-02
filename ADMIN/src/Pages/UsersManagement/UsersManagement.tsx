import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Select, Space, Avatar, Tag, Spin, Input, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined, EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useUsers } from './Hook/useGetUsers';
import { useDeleteUser } from './Hook/useDeleteUser'; 
import { useDebounce } from '@/Hook/useDebounce'; 
import { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';
import UserUpdateModal from './Components/UserUpdateModal'; 
import UserCreateModal from './Components/CreateUserModal';
import DeleteUserModal from './Components/DeleteUserModal';

const UserManagementView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageInfo, setPageInfo] = useState({
    size: 5,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  });

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUsersResponse | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<IUsersResponse | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  //? Reset page to first page when status or search changes
  useEffect(() => {
    setPageInfo(prev => ({ ...prev, number: 0 }));
  }, [statusFilter, debouncedSearch]);

  const { data, isLoading, error } = useUsers({
    status: statusFilter,
    page: pageInfo.number,
    size: pageInfo.size,
    keyword: debouncedSearch,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser({
    onSuccess: () => {
      setDeleteModalVisible(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Lỗi xóa user:', error);
    },
  });

  const users: IUsersResponse[] = useMemo(() => (data?.data?.content || []) as IUsersResponse[], [data]);

  const pagination = useMemo(() => data?.data?.page || pageInfo, [data, pageInfo]);

  const filteredUsers: IUsersResponse[] = useMemo(
    () =>
      users.filter((user: IUsersResponse) =>
        roleFilter === 'all' ? true : user.roles.some((role: UserRoles) => role.name === roleFilter)
      ),
    [users, roleFilter]
  );

  const handleCreateUser = () => {
    setCreateModalVisible(true);
  };

  const handleUpdateUser = (user: IUsersResponse) => {
    setSelectedUser(user);
    setUpdateModalVisible(true);
  };

  const handleViewUser = (user: IUsersResponse) => {
    navigate(`user-detail/${user.id}`); 
  };

  const handleOpenDeleteModal = (user: IUsersResponse) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

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
            icon={<EditOutlined />}
            onClick={() => handleUpdateUser(record)}
            title="Chỉnh sửa"
          >
            Chỉnh sửa
          </Button>
          <Button 
            type="link" 
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleOpenDeleteModal(record)}
            title="Xóa"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const isDetailView = location.pathname.startsWith('/users/user-detail');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {isDetailView ? (
        <Outlet /> 
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý người dùng</h1>

          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} lg={8}>
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Tìm kiếm theo tên hoặc email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="w-full"
                  size="large"
                />
              </Col>
              <Col xs={24} sm={6} lg={4}>
                <Select
                  placeholder="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={(value: string) => setStatusFilter(value)}
                  className="w-full"
                  size="large"
                >
                  <Select.Option value="all">Tất cả trạng thái</Select.Option>
                  <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                  <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={6} lg={4}>
                <Select
                  placeholder="Lọc theo vai trò"
                  value={roleFilter}
                  onChange={(value: string) => setRoleFilter(value)}
                  className="w-full"
                  size="large"
                >
                  <Select.Option value="all">Tất cả vai trò</Select.Option>
                  <Select.Option value="USER">Người dùng</Select.Option>
                  <Select.Option value="STAFF">Nhân viên</Select.Option>
                  <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} lg={8} className="text-right">
                <Space>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={() => window.location.reload()}
                    size="large"
                  >
                    Áp dụng lọc
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateUser}
                    size="large"
                  >
                    Thêm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-center">Không thể tải danh sách người dùng</div>
          )}

          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              pagination={{
                current: pagination.number + 1,
                pageSize: pagination.size,
                total: pagination.totalElements,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onChange: (page, pageSize) => {
                  setPageInfo(prev => ({ 
                    ...prev, 
                    number: page - 1, 
                    size: pageSize 
                  }));
                },
              }}
              className="shadow rounded-lg"
              scroll={{ x: 'max-content' }}
            />
          </Spin>

          <UserCreateModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
          />

          <UserUpdateModal
            visible={updateModalVisible}
            onCancel={() => setUpdateModalVisible(false)}
            user={selectedUser}
          />

          <DeleteUserModal
            visible={deleteModalVisible}
            onCancel={handleCancelDelete}
            user={userToDelete}
            onConfirm={handleConfirmDelete}
            loading={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default UserManagementView;