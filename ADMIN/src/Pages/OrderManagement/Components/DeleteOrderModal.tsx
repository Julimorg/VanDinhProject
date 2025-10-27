import React from "react";
import { Modal, Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDeleteOrder } from "../Hook/useDeleteOrder";

const { Text } = Typography;

interface DeleteOrderModalProps {
  open: boolean;
  orderId: string;
  orderCode?: string;
  onCancel: () => void;
  onDeleteSuccess?: () => void;
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  open,
  orderId,
  orderCode,
  onCancel,
  onDeleteSuccess,
}) => {
  const { mutate, isPending } = useDeleteOrder({
    onSuccess: () => {
      onCancel();
      onDeleteSuccess?.();
    },
  });

  const handleDelete = () => {
    mutate(orderId);
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
          Bạn có chắc chắn muốn xóa đơn hàng{" "}
          <Text strong>{orderCode || "này"}</Text> không? Hành động này không thể hoàn tác.
        </Text>
      </div>
    </Modal>
  );
};

export default DeleteOrderModal;
