import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { IUsersResponse } from '@/Interface/Users/IGetUsers';

interface DeleteUserModalProps {
  visible: boolean;
  onCancel: () => void;
  user: IUsersResponse | null;
  onConfirm: () => void;
  loading?: boolean; 
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ 
  visible, 
  onCancel, 
  user, 
  onConfirm, 
  loading = false 
}) => {
  if (!user) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <ExclamationCircleOutlined className="mr-2 text-red-500" />
          Xác nhận xóa
        </div>
      }
      open={visible}
      onOk={onConfirm} 
      onCancel={onCancel}
      okText="Xóa"
      okType="danger"
      cancelText="Hủy"
      confirmLoading={loading} 
      width={400}
      closable={false} 
      maskClosable={false}
    >
      <p>Bạn có chắc chắn muốn xóa người dùng "<strong>{user.userName}</strong>"?</p>
      <p className="text-red-500">Hành động này không thể hoàn tác!</p>
    </Modal>
  );
};

export default DeleteUserModal;