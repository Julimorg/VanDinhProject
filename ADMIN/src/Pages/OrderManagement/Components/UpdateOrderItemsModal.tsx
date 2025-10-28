import React from "react";
import { Modal, Table, InputNumber, Typography, Button, Space } from "antd";

const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

const UpdateOrderItemsModal: React.FC<Props> = ({ open, onClose, orderData }) => {
  const sampleItems = [
    { key: "1", productName: "Áo thun trắng", quantity: 2, price: 150000 },
    { key: "2", productName: "Quần jeans", quantity: 1, price: 350000 },
  ];

  const columns = [
    { title: "Sản phẩm", dataIndex: "productName" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (val: number) => <InputNumber min={1} defaultValue={val} />,
    },
    {
      title: "Đơn giá (₫)",
      dataIndex: "price",
      render: (val: number) => val.toLocaleString("vi-VN"),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      title={
        <Title level={4} style={{ color: "#1677ff", margin: 0 }}>
          Cập nhật sản phẩm trong đơn
        </Title>
      }
    >
      <Table
        columns={columns}
        dataSource={sampleItems}
        pagination={false}
        bordered
      />

      <Space style={{ width: "100%", justifyContent: "flex-end", marginTop: 16 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary">Lưu thay đổi</Button>
      </Space>
    </Modal>
  );
};

export default UpdateOrderItemsModal;
