import React from "react";
import { Modal, Select, Typography, Space, Button, Form, message } from "antd";
import { useApproveOrderStatus } from "../Hook/useApproveOrderStatus";
import { useAuthStore } from "@/Store/IAuth";
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  orderData?: {
    orderId: string;
    orderCode?: string;
  } | null;
  onSuccess?: () => void; 
}

const ApproveOrderModal: React.FC<Props> = ({
  open,
  onClose,
  orderData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const adminUserId = useAuthStore((state) => state.id) ?? "";

  const { mutate: approveOrder, isPending } = useApproveOrderStatus(
    adminUserId,
    orderData?.orderId || "",
    {
      onSuccess: (res) => {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        form.resetFields();
        onClose();
        onSuccess?.(); 
      },
      onError: (err) => {
        console.error(err);
        toast.error("Cập nhật trạng thái đơn hàng thất bại!");
      },
    }
  );

  const handleSubmit = (values: any) => {
    approveOrder({ orderStatus: values.orderStatus });
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      centered
      destroyOnClose
      title={
        <Title level={4} style={{ color: "#1677ff", margin: 0 }}>
          Thay đổi trạng thái đơn hàng
        </Title>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          label="Trạng thái đơn hàng"
          name="orderStatus"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái mới">
            <Option value="Approved">Duyệt đơn hàng</Option>
            <Option value="Canceled">Hủy đơn hàng</Option>
          </Select>
        </Form.Item>

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            disabled={!orderData?.orderId}
          >
            Lưu thay đổi
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ApproveOrderModal;
