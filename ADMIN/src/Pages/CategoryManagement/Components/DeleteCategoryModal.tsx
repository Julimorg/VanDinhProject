import React from "react";
import { Modal, Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDeleteCategory } from "../Hook/useDeleteCategory";

const { Text } = Typography;

interface DeleteCategoryModalProps {
  open: boolean;
  categoryId: string;
  categoryName?: string;
  onCancel: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps & {onDeleteSuccess?: () => void}> = ({
  open,
  categoryId,
  categoryName,
  onCancel,
  onDeleteSuccess,
}) => {
  const { mutate, isPending } = useDeleteCategory({
    onSuccess: () => {
        onCancel();
        onDeleteSuccess?.();
    }
  });

  const handleDelete = () => {
    mutate(categoryId);
  };

  return (
    <Modal
      open={open}
      title="Xác nhận xóa"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          loading={isPending}
          onClick={handleDelete}
        >
          Xóa
        </Button>,
      ]}
      centered
    >
      <div className="flex items-center gap-2">
        <ExclamationCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />
        <Text>
          Bạn có chắc chắn muốn xóa danh mục{" "}
          <Text strong>{categoryName || "này"}</Text> không? Hành động này không thể hoàn tác.
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
