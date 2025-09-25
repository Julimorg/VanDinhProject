import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Typography, Switch } from 'antd';
import { EditFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { useGetUser } from '../Hook/useGetUser';
import { docApi } from '@/Api/docApi';
import type { GetUserData } from '@/Interface/TGetUser';
import { toast } from 'react-toastify';
import EditUsersModal from './EditUsersModal';
import { useQueryClient } from '@tanstack/react-query';
import { useChangeUserStatusOptions } from '../Hook/useChangeUserSt';

const { Text } = Typography;

const UserTable = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [resetModal, setResetModal] = useState({ visible: false, userId: '', confirm: false });
  const [resetLoading, setResetLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ visible: boolean; userId: string }>({
    visible: false,
    userId: '',
  });

  const { data: userResponse, isLoading, error, refetch } = useGetUser();

  const users: GetUserData[] = userResponse?.data || [];

  const filteredUsers = users.filter((user) =>
    [user.userName, user.email].join(' ').toLowerCase().includes(searchText.toLowerCase())
  );

  const queryClient = useQueryClient();
  const { mutate: changeStatus, isPending } = useChangeUserStatusOptions();

  const handleResetPassword = async () => {
    if (!resetModal.confirm || !resetModal.userId) return;
    try {
      setResetLoading(true);
      await docApi.UpdateUser(resetModal.userId, { password: '123456' });
      toast.success('Reset mật khẩu thành công! Mật khẩu mới là: 123456');
      setResetModal({ visible: false, userId: '', confirm: false });
    } catch (err) {
      console.error('Reset password failed:', err);
      toast.error('Reset mật khẩu thất bại!');
    } finally {
      setResetLoading(false);
    }
  };

  const columns: ColumnsType<GetUserData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => id || 'N/A',
    },
    {
      title: 'Tên',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
      render: (name) => name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      render: (email) => email || 'N/A',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (roles?.length ? roles.join(', ') : 'N/A'),
      filters: [
        { text: 'ADMIN', value: 'ADMIN' },
        { text: 'Receptionist', value: 'Receptionist' },
      ],
      onFilter: (value, record) => record.roles?.includes(value as string) || false,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_Active',
      key: 'is_Active',

      render: (active, record) => (
        <Switch
          checked={active}
          loading={isPending}
          onChange={(checked) => {
            changeStatus(
              { id: record.id!, isActive: checked },
              {
                onSuccess: () => {
                  toast.success('Cập nhật trạng thái thành công');
                  queryClient.invalidateQueries({ queryKey: ['get-user'] });
                  refetch();
                },
                onError: () => {
                  toast.error('Thay đổi trạng thái thất bại');
                },
              }
            );
          }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => {
        const role = record.roles?.[0];
        return (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditFilled />}
              title="Chỉnh sửa"
              onClick={() => setEditModal({ visible: true, userId: record.id || '' })}
            />
            {role !== 'Receptionist' && (
              <Button
                type="link"
                disabled={role === 'ADMIN' || role === 'SUPERADMIN'}
                onClick={() =>
                  setResetModal({ visible: true, userId: record.id || '', confirm: false })
                }
              >
                Reset mật khẩu
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quản lý người dùng</h2>
        <Button onClick={() => navigate('/add-users')} icon={<span>+</span>} type="primary">
          Thêm người dùng
        </Button>
      </div>

      <Input.Search
        placeholder="Tìm kiếm theo tên hoặc email..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
        allowClear
      />

      {error && (
        <Text type="danger" className="block mb-4">
          Đã có lỗi xảy ra khi tải danh sách người dùng.
        </Text>
      )}

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
        loading={isLoading}
      />

      {/* Reset Password Modal */}
      {resetModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-md">
            <h3 className="mb-3 text-lg font-semibold">Xác nhận reset mật khẩu</h3>
            <p className="mb-4 text-sm text-gray-700">
              Bạn có chắc chắn muốn reset mật khẩu người dùng này không?
              <br />
              Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="confirmReset"
                checked={resetModal.confirm}
                onChange={() => setResetModal((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="mr-2"
              />
              <label htmlFor="confirmReset" className="text-sm">
                Tôi đồng ý reset password
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setResetModal({ visible: false, userId: '', confirm: false })}
              >
                Hủy bỏ
              </button>
              <button
                disabled={!resetModal.confirm}
                className={`px-4 py-2 rounded-md text-white ${
                  resetModal.confirm
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
                onClick={handleResetPassword}
              >
                {resetLoading ? 'Đang reset...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal.visible && (
        <EditUsersModal
          visible={editModal.visible}
          userId={editModal.userId}
          onClose={() => setEditModal({ visible: false, userId: '' })}
          onSuccess={() => {
            toast.success('Cập nhật người dùng thành công!');
          }}
        />
      )}
    </div>
  );
};

export default UserTable;
