import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDeleteProduct } from '../Hook/useDeleteProduct';
import { toast } from 'react-toastify';
const { Text } = Typography;

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  productId: string; 
  productName: string;
  onSuccess?: () => void; 
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onCancel,
  productId,
  productName,
  onSuccess,
}) => {
  const deleteProductMutation = useDeleteProduct({
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!');
      onSuccess?.(); 
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    },
  });

  const handleConfirm = async () => {
    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (err) {
     toast.error(`Thao tác đang gặp trực trặc - ${err} !`);
    } finally {
      onCancel();
    }
  };

  const loading = deleteProductMutation.isPending;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <ExclamationCircleOutlined className="text-red-500 mr-2" />
          <Text strong>Xác nhận xóa sản phẩm</Text>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleConfirm}
          loading={loading}
          disabled={loading}
        >
          Xóa
        </Button>,
      ]}
      centered
      width={400}
      closable={!loading} 
      maskClosable={!loading} 
    >
      <Text>
        Bạn có chắc chắn muốn xóa sản phẩm "<Text strong>{productName}</Text>" không? 
        Hành động này không thể hoàn tác.
      </Text>
    </Modal>
  );
};

export default ConfirmDeleteModal;