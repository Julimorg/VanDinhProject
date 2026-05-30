
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useUpdatePurchaseOrder } from '../Hooks/useUpdatePurchaseOrder';
import { IUpdatePurchaseOrder } from '@/Interface/Inventory/UpdatePurchaseOrder';

const { TextArea } = Input;
const { Option } = Select;

const STATUS_OPTIONS = [
  { value: 'DRAFT',    label: 'Nháp' },
  { value: 'RECEIVED', label: 'Đã nhận' },
];

interface POEditModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    id: string;
    poCode: string;
    supplierName: string;
    note: string;
    status: string;
  };
}

const POEditModal: React.FC<POEditModalProps> = ({ open, onClose, data }) => {
  const [form] = Form.useForm();
  const { mutate: updatePO, isPending } = useUpdatePurchaseOrder();

  // Populate form khi mở modal
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        poCode:       data.poCode,
        supplierName: data.supplierName,
        note:         data.note,
        status:       data.status,
      });
    }
  }, [open, data, form]);

  const handleSubmit = () => {
    form.validateFields().then((values: IUpdatePurchaseOrder) => {
      updatePO(
        { id: data.id, payload: values },
        { onSuccess: onClose }
      );
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={
        <div style={{ paddingBottom: 4 }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, fontFamily: 'monospace' }}>
            Phiếu nhập kho
          </p>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Chỉnh sửa phiếu
          </span>
        </div>
      }
      footer={null}
      width={540}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 8 }}
      >
        {/* Mã phiếu */}
        <Form.Item
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Mã phiếu</span>}
          name="poCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}
        >
          <Input
            placeholder="VD: PO-2024-001"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        {/* Nhà cung cấp */}
        <Form.Item
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Nhà cung cấp</span>}
          name="supplierName"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input
            placeholder="Tên nhà cung cấp"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        {/* Trạng thái */}
        <Form.Item
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Trạng thái</span>}
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái" style={{ borderRadius: 8 }}>
            {STATUS_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ghi chú */}
        <Form.Item
          label={<span style={{ fontWeight: 600, color: '#374151' }}>Ghi chú</span>}
          name="note"
        >
          <TextArea
            rows={4}
            placeholder="Nhập ghi chú (không bắt buộc)"
            style={{ borderRadius: 8, resize: 'none' }}
          />
        </Form.Item>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button onClick={handleCancel} style={{ borderRadius: 8 }}>
            Huỷ
          </Button>
          <Button
            type="primary"
            loading={isPending}
            onClick={handleSubmit}
            style={{ borderRadius: 8, background: '#4F46E5', borderColor: '#4F46E5' }}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default POEditModal;