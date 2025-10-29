import React from "react";
import { Modal, Select, Typography, Space, Button, Form } from "antd";

const { Title } = Typography;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

const ApproveOrderModal: React.FC<Props> = ({ open, onClose, orderData }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <Title level={4} style={{ color: "#1677ff", margin: 0 }}>
          Thay đổi trạng thái đơn hàng
        </Title>
      }
    >
      <Form form={form} layout="vertical" className="mt-4">
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
          <Button type="primary">Lưu thay đổi</Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ApproveOrderModal;
