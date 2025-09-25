import React, { useEffect } from 'react';
import { Form, InputNumber, DatePicker, Modal, Typography } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface EditDiscountServiceModalProps {
  visible: boolean;
  serviceId?: string;
  onClose: () => void;
  onSubmit?: (values: any, serviceId?: string) => void;
  confirmLoading?: boolean;
}

const EditDiscountServiceModal: React.FC<EditDiscountServiceModalProps> = ({
  visible,
  serviceId,
  onClose,
  onSubmit,
  confirmLoading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit?.(values, serviceId);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={visible}
      title={<Title level={4}>Thêm khuyến mãi</Title>}
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
          // discount_value_vnd: 0,
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
          label="Giảm giá (%)"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá trị giảm',
            },
            {
              validator: (_, value) => {
                if (typeof value === 'string' && /[.,]/.test(value)) {
                  return Promise.reject(new Error('Không được nhập dấu phẩy hoặc chấm'));
                }
                if (typeof value === 'number' && (value < 1 || value > 100)) {
                  return Promise.reject(new Error('Nhập từ 1 đến 100%'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            step={1}
            placeholder="Nhập %"
            onKeyDown={(e) => {
              if (e.key === ',' || e.key === '.') {
                e.preventDefault();
              }
            }}
            parser={(value) => {
              const cleaned = value?.replace(/[.,]/g, '');
              return cleaned ? Number(cleaned) : 0;
            }}
          />
        </Form.Item>

        <Form.Item name="discount_value_another" hidden>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDiscountServiceModal;
