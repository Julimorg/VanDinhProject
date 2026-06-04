import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { useUpdateDiaryItem } from '../Hooks/useUpdateDiaryItem';
import { IUpdateDiaryItemReq } from '@/Interface/Diary/UpdateDiaryItem';

interface UpdateDiaryItemModalProps {
  open: boolean;
  itemId: string | null;
  initialValues: IUpdateDiaryItemReq | null;
  onClose: () => void;
}

const UpdateDiaryItemModal: React.FC<UpdateDiaryItemModalProps> = ({
  open,
  itemId,
  initialValues,
  onClose,
}) => {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [form] = Form.useForm<IUpdateDiaryItemReq>();
  const { mutate: updateItem, isPending } = useUpdateDiaryItem();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        productName: initialValues.productName,
        quantity:    initialValues.quantity,
        unitPrice:   initialValues.unitPrice,
        itemNote:    initialValues.itemNote ?? '',
        color:       initialValues.color    ?? '',
        volume:      initialValues.volume   ?? '',
      });
    }
  }, [open, initialValues]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    updateItem(
      { diaryId: diaryId!, itemId: itemId!, body: values },
      { onSuccess: onClose }
    );
  };

  return (
    // 👇 bọc div stopPropagation thay vì để onClick trên Modal
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        open={open}
        onCancel={onClose}
        title="Chỉnh sửa sản phẩm"
        centered
        getContainer={document.body}
        destroyOnHidden   // 👈 thay destroyOnClose (deprecated)
        footer={[
          <Button key="cancel" onClick={onClose} disabled={isPending}>
            Huỷ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPending}
            onClick={handleSubmit}
            style={{ background: '#C17B3F', borderColor: '#C17B3F' }}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Tên sản phẩm không được để trống!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" maxLength={150} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Số lượng phải lớn hơn 0!' }]}
            >
              <InputNumber<number>
                min={1}
                placeholder="0"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="unitPrice"
              label="Đơn giá (VNĐ)"
              rules={[{ required: true, message: 'Đơn giá phải lớn hơn 0!' }]}
            >
              <InputNumber<number>
                min={1}
                placeholder="0"
                style={{ width: '100%' }}
                formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '')}
                parser={(v) => Number(v?.replace(/\./g, '') ?? 0) as unknown as number} // 👈 ép kiểu đúng
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="color" label="Màu sắc">
              <Input placeholder="VD: Đỏ, Xanh..." maxLength={50} />
            </Form.Item>
            <Form.Item name="volume" label="Quy cách">
              <Input placeholder="VD: 500ml, 1kg..." maxLength={50} />
            </Form.Item>
          </div>

          <Form.Item name="itemNote" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú thêm..." rows={3} maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateDiaryItemModal;