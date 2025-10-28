import React from 'react';
import { Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import type { IApiResponse } from '@/Interface/IApiResponse';
import { useDeleteColor } from '../Hook/useDeleteColor';
import { QueryKeys } from '@/Constant/query-key';
import { toast } from 'react-toastify';

interface DeleteColorModalProps {
  visible: boolean;
  onCancel: () => void;
  colorId: string;
  colorName: string;
}

const DeleteColorModal: React.FC<DeleteColorModalProps> = ({
  visible,
  onCancel,
  colorId,
  colorName,
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor({
    onSuccess: (data: IApiResponse<void>) => {
      toast.success(`Xóa ${data.message}`);
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_COLORS] });
      onCancel();
    },
    onError: (error) => {
      toast.error(`Lỗi khi xóa màu: ${error}`);
    },
  });

  const handleConfirm = () => {
    console.log(`colorId: ${colorId}`);
    deleteColor(colorId);
  };

  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Xóa"
      okType="danger"
      cancelText="Hủy"
      confirmLoading={isDeleting}
      okButtonProps={{ disabled: isDeleting }}
    >
      <p>Bạn có chắc chắn muốn xóa mã màu "{colorName}" không? Hành động này không thể hoàn tác.</p>
    </Modal>
  );
};

export default DeleteColorModal;
