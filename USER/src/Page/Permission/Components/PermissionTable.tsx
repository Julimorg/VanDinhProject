import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Permission, CreatePermission } from '@/Interface/TPermission';

import CreatePermissionModal from './PermissionModal';
import { useGetPermission } from '@/Hook/useGetPermission';
import { useCreatePermission } from '../hook/ useCreatePermission';

const columns: ColumnsType<Permission> = [
  // {
  //   title: 'ID',
  //   dataIndex: 'permission_id',
  //   key: 'permission_id',
  // },
  {
    title: 'Tên quyền',
    dataIndex: 'permission_name',
    key: 'permission_name',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
  },
];

const PermissionTable: React.FC = () => {
  const { data, isLoading } = useGetPermission();
  const { mutateAsync: createPermission } = useCreatePermission();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePermission = async (formData: CreatePermission) => {
    await createPermission(formData);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Tạo quyền
        </Button>
      </Space> */}

      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="permission_id"
        loading={isLoading}
        pagination={false}
      />

      <CreatePermissionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePermission}
      />
    </div>
  );
};

export default PermissionTable;
