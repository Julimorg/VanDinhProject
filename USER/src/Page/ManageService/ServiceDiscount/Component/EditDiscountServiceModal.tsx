import React, { useEffect } from 'react';
import { Form, InputNumber, DatePicker, Modal, Typography } from 'antd';
import type { DiscountServiceItem } from '@/Interface/TDiscountService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface EditDiscountServiceModalProps {
  visible: boolean;
  id?: string;
  onClose: () => void;
  onSubmit?: (values: any, serviceId?: string) => void;
  confirmLoading?: boolean;
  record?: DiscountServiceItem;
}

const EditDiscountServiceModal: React.FC<EditDiscountServiceModalProps> = ({
  visible,
  id,
  onClose,
  onSubmit,
  confirmLoading = false,
  record,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        discount_value_vnd: record.discount_value_vnd,
        discount_value_another: record.discount_value_another ?? 0,
        dateRange: [dayjs(record.start_date), dayjs(record.end_date)],
      });
    }
  }, [visible, record, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit?.(values, id);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={visible}
      title={<Title level={4}>Chỉnh sửa giảm giá</Title>}
      onCancel={onClose}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          discount_type: 'PERCENTAGE',
          discount_value_vnd: 0,
        }}
      >
        <Form.Item
          name="dateRange"
          label="Khoảng thời gian"
          rules={[{ required: true, message: 'Chọn khoảng thời gian' }]}
        >
          <RangePicker
            style={{ width: '100%' }}
            disabledDate={(current) => {
              return current && current < dayjs().startOf('day');
            }}
          />
        </Form.Item>

        <Form.Item
          name="discount_value_vnd"
          label="Giá trị giảm (%)"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm (%)' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            step={1}
            placeholder="Nhập %"
            stringMode={false}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',') {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDiscountServiceModal;
