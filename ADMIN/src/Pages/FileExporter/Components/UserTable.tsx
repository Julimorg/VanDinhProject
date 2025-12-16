import React from 'react';
import { Table, Card, Typography, Spin, Avatar, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';

const { Text } = Typography;

interface UserTableProps {
  users: IUsersResponse[];
  isLoading: boolean;
  error: any;
  pagination: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  error,
  pagination,
  onPageChange,
  selectedUserId,
  onSelectUser,
  searchTerm,
  onSearchChange,
}) => {
  const columns: ColumnsType<IUsersResponse> = [
    {
      title: 'Avatar',
      dataIndex: 'userImg',
      key: 'userImg',
      render: (userImg: string) => (
        <Avatar src={userImg} size={40} icon={<UserOutlined />}>
          {!userImg && 'N/A'}
        </Avatar>
      ),
      width: 80,
      responsive: ['md'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[],
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
        <Space wrap>
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
      render: (createAt: string) => dayjs(createAt).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      responsive: ['lg'] as ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[],
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type={selectedUserId === record.id ? 'primary' : 'default'}
          icon={<CheckOutlined />}
          onClick={() => onSelectUser(record.id)}
          size="middle"
          className="w-full sm:w-auto"
        >
          {selectedUserId === record.id ? 'Đã chọn' : 'Chọn'}
        </Button>
      ),
    },
  ];

  const rowClassName = (record: IUsersResponse) => {
    return selectedUserId === record.id ? 'bg-blue-50 border-l-4 border-blue-500' : '';
  };

  return (
    <Card size="small" className="bg-white">
      <div className="mb-4">
        <Text strong className="text-base sm:text-lg">
          Danh sách người dùng
        </Text>
        {selectedUserId && (
          <Text type="success" className="ml-2 text-sm">
            ✓ Đã chọn người dùng
          </Text>
        )}
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-center">
          Không thể tải danh sách người dùng
        </div>
      )}

      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: pagination.number + 1,
            pageSize: pagination.size,
            total: pagination.totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} người dùng`,
            onChange: onPageChange,
          }}
          className="shadow-sm"
          scroll={{ x: 'max-content' }}
          size="middle"
          rowClassName={rowClassName}
        />
      </Spin>
    </Card>
  );
};

export default UserTable;
