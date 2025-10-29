import React, { useMemo, useState } from 'react';
import { Modal, Form, Input, Button, Select, message, InputNumber, Row, Col, Space, Tag } from 'antd';
import { useCreateOrder } from '../Hook/useCreateOrder';
import { useGetUserSelections } from '../Hook/useGetUserSelection';
import { useGetProductSelections } from '../Hook/useGetProductSelection';
import { ICreateOrderRequest } from '@/Interface/Order/ICreateOrder';

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminUserId: string; // Admin hiện tại
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose, onSuccess, adminUserId }) => {
  const [form] = Form.useForm();

  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const { mutate: createOrder, isPending } = useCreateOrder({
    onSuccess: () => {
      message.success('Tạo đơn hàng thành công!');
      form.resetFields();
      setOrderItems([]);
      setSelectedProductIds([]);
      onSuccess();
    },
    onError: (err: any) => {
      message.error(`Tạo đơn hàng thất bại: ${err?.message ?? err}`);
    },
  });

  const { data: userSelection } = useGetUserSelections();
  const { data: productSelection } = useGetProductSelections();

  const productMap = useMemo(() => {
    const map = new Map<string, string>();
    (productSelection?.data ?? []).forEach((p: any) => map.set(p.productId, p.productName));
    return map;
  }, [productSelection]);

  const handleProductsChange = (values: string[]) => {
    setSelectedProductIds(values);

    const updated = values.map((id) => {
      const existing = orderItems.find((it) => it.productId === id);
      return existing ? existing : { productId: id, quantity: 1 };
    });

    setOrderItems(updated);
  };

  const handleQuantityChange = (productId: string, qty: number | null) => {
    const safeQty = Math.max(1, qty ?? 1);
    setOrderItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, quantity: safeQty } : it))
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    setOrderItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const handleSubmit = (values: any) => {
    if (orderItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 sản phẩm!');
      return;
    }

    if (!values.userId) {
      message.error('Vui lòng chọn khách hàng!');
      return;
    }

    const requestBody: ICreateOrderRequest = {
      id: values.userId,
      shipAddress: values.shipAddress,
      paymentMethod: values.paymentMethod,
      orderItems: orderItems.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
    };

    // FE gửi adminUserId lên URL
    createOrder({
      userId: adminUserId,
      body: requestBody,
    });
  };

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
        setOrderItems([]);
        setSelectedProductIds([]);
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="userId"
          label="Người dùng"
          rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
        >
          <Select
            placeholder="Chọn người dùng"
            options={
              userSelection?.data?.map((u: any) => ({
                label: `${u.firstName} ${u.lastName} (${u.userName})`,
                value: u.id,
              })) ?? []
            }
          />
        </Form.Item>

        <Form.Item
          name="orderItemsSelect"
          label="Sản phẩm"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 sản phẩm!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm"
            options={
              productSelection?.data?.map((p: any) => ({
                label: p.productName,
                value: p.productId,
              })) ?? []
            }
            value={selectedProductIds}
            onChange={handleProductsChange}
          />
        </Form.Item>

        {orderItems.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Row gutter={[8, 8]}>
              {orderItems.map((it) => (
                <Col span={24} key={it.productId}>
                  <Space align="center" className="w-full" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Tag>{productMap.get(it.productId) ?? it.productId}</Tag>
                      <Button type="link" onClick={() => handleRemoveProduct(it.productId)} style={{ padding: 0 }}>
                        Xóa
                      </Button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>Số lượng:</span>
                      <InputNumber
                        min={1}
                        value={it.quantity}
                        onChange={(v) => handleQuantityChange(it.productId, v)}
                        style={{ width: 120 }}
                      />
                    </div>
                  </Space>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Form.Item
          name="shipAddress"
          label="Địa chỉ giao hàng"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="VD: 123 Nguyễn Trãi, Hà Nội" />
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Phương thức thanh toán"
          rules={[{ required: true, message: 'Vui lòng nhập phương thức!' }]}
        >
          <Select
            placeholder="Chọn phương thức thanh toán"
            options={[
              { label: 'Tiền mặt (COD)', value: 'CASH' },
              { label: 'VNPAY', value: 'VN_PAY' },
              { label: 'PAYPAL', value: 'PAY_PAL' },
            ]}
          />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Button onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending} className="ml-2">
            Tạo đơn
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderModal;
