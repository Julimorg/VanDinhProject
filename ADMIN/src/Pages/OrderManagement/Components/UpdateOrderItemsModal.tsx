import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  InputNumber,
  Typography,
  Button,
  Space,
  message,
} from "antd";
import { useUpdateOrderItem } from "../Hook/useUpdateOrderItem";
import { useGetOrderDetail } from "../Hook/useGetOrderDetail";

const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

const UpdateOrderItemsModal: React.FC<Props> = ({
  open,
  onClose,
  orderData,
}) => {
  const [items, setItems] = useState<any[]>([]);

  // 🟢 Hook lấy chi tiết đơn hàng
  const {
    data: orderDetail,
    isLoading,
    refetch,
  } = useGetOrderDetail(orderData?.orderId, {
    enabled: open && !!orderData?.orderId,
  });

  const { mutate: updateOrderItem, isPending } = useUpdateOrderItem(
    orderData?.orderId,
    {
      onSuccess: () => {
        message.success("Cập nhật sản phẩm trong đơn thành công!");
        refetch(); // refresh lại dữ liệu mới
        onClose();
      },
      onError: (err) => {
        console.error(err);
        message.error("Cập nhật thất bại!");
      },
    }
  );

  // 🟢 Đồng bộ dữ liệu khi fetch xong
  useEffect(() => {
    if (orderDetail?.data?.orderItems) {
      setItems(orderDetail.data.orderItems);
    }
  }, [orderDetail]);

  const handleQuantityChange = (value: number, key: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.orderItemId === key ? { ...item, quantity: value } : item
      )
    );
  };

  const handleSave = () => {
    const payload = {
      orderItems: items.map((i) => ({
        orderItemId: i.orderItemId,
        productId: i.productId,
        quantity: i.quantity,
      })),
    };
    updateOrderItem(payload);
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (val: number, record: any) => (
        <InputNumber
          min={1}
          value={val}
          onChange={(v) => handleQuantityChange(v || 1, record.orderItemId)}
        />
      ),
    },
    {
      title: "Đơn giá (₫)",
      dataIndex: "productPrice",
      render: (val: number) => val?.toLocaleString("vi-VN"),
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
        dataSource={items}
        pagination={false}
        bordered
        rowKey="orderItemId"
        loading={isLoading}
      />

      <Space
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <Button onClick={onClose}>Hủy</Button>
        <Button
          type="primary"
          loading={isPending}
          onClick={handleSave}
          disabled={items.length === 0}
        >
          Lưu thay đổi
        </Button>
      </Space>
    </Modal>
  );
};

export default UpdateOrderItemsModal;
