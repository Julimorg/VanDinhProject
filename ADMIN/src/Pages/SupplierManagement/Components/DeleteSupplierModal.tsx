import { Modal, Typography, Button, Space } from 'antd';
import { useDeleteSupplier } from '../Hook/useDeleteSupplier'; 
import { toast } from 'react-toastify'; 

const { Text, Title } = Typography;

interface DeleteSupplierModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  supplier: any; 
}

const DeleteSupplierModal: React.FC<DeleteSupplierModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  supplier,
}) => {
  const supplierId = supplier?.supplierId;

  const { mutate: deleteSupplier, isPending } = useDeleteSupplier({
    onSuccess: () => {
      toast.success('Xóa nhà cung cấp thành công!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Lỗi xóa nhà cung cấp: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (!supplierId) {
      toast.error('Không tìm thấy ID nhà cung cấp!');
      return;
    }

    deleteSupplier(supplierId);

  };

  return (
    <Modal
      title={
        <Title level={5} className="mb-0 text-red-600">
          Xác nhận xóa
        </Title>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Space key="footer">
          <Button onClick={onCancel} disabled={isPending}>Hủy</Button>
          <Button 
            type="primary" 
            danger 
            onClick={handleDelete}
            loading={isPending}
            disabled={!supplierId}
          >
            Xóa
          </Button>
        </Space>,
      ]}
      centered
      width={400}
      closable={false}
      maskClosable={false} 
    >
      <div className="text-center py-4">
        <Text type="secondary" className="block mb-4">
          Bạn có chắc chắn muốn xóa nhà cung cấp "<Text strong>{supplier?.supplierName}</Text>" không?
        </Text>
        <Text type="danger" className="block">
          Thao tác này không thể hoàn tác!
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteSupplierModal;