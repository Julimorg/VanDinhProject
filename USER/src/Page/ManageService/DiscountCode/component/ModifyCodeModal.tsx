import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import type { DiscountCodeUpdate } from '@/Interface/TDiscountCode';
import dayjs from 'dayjs';

interface DeleteConfirmModalProps {
  open: boolean;
  loading?: boolean;
  onOk: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  okText?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  okText,
  loading = false,
  onOk,
  onCancel,
  title = 'Xác nhận xoá',
  description = 'Bạn có chắc chắn muốn xoá mục này không?',
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      confirmLoading={loading}
      onCancel={onCancel}
      okText={okText}
      cancelText="Huỷ"
      okButtonProps={{ danger: true }}
    >
      <p>{description}</p>
    </Modal>
  );
};

interface EditDiscountCodeModalProps {
  open: boolean;
  loading?: boolean;
  initialValues: DiscountCodeUpdate;
  onCancel: () => void;
  onSubmit: (values: DiscountCodeUpdate) => void;
  title?: string;
}

export const EditDiscountCodeModal: React.FC<EditDiscountCodeModalProps> = ({
  open,
  loading,
  initialValues,
  onCancel,
  onSubmit,
  title,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues: DiscountCodeUpdate = {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
      };
      onSubmit(formattedValues);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  return (
    <Modal
      title={title || 'Thêm mã giảm giá'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          ...initialValues,
          start_date: initialValues.start_date ? dayjs(initialValues.start_date) : undefined,
          end_date: initialValues.end_date ? dayjs(initialValues.end_date) : undefined,
        }}
      >
        <Form.Item
          label="Mã giảm giá"
          name="discount_code"
          rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá' }]}
        >
          <Input placeholder="Nhập mã giảm giá" />
        </Form.Item>

        <Form.Item
          label="Phần trăm giảm"
          name="value_percentage"
          rules={[
            { required: true, message: 'Vui lòng nhập phần trăm giảm' },
            {
              validator: (_, value) =>
                Number.isInteger(value) && value > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error('% giảm phải là số nguyên dương')),
            },
          ]}
        >
          <InputNumber<number>
            placeholder="Nhập %"
            min={1}
            max={100}
            precision={0}
            addonAfter="%"
            style={{ width: '100%' }}
            inputMode="numeric"
            onKeyDown={(e) => {
              if (['.', ',', 'e'].includes(e.key)) e.preventDefault();
            }}
          />
        </Form.Item>

        <Form.Item
          label="Tổng số lượng"
          name="total"
          rules={[
            { required: true, message: 'Vui lòng nhập tổng số lượng' },
            {
              validator: (_, value) =>
                Number.isInteger(value) && value > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error('Tổng số lượng phải là số nguyên dương')),
            },
          ]}
        >
          <InputNumber<number>
            placeholder="Nhập số lượng"
            min={1}
            precision={0}
            style={{ width: '100%' }}
            inputMode="numeric"
            onKeyDown={(e) => {
              if (['.', ',', 'e'].includes(e.key)) e.preventDefault();
            }}
          />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="start_date"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="end_date"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            placeholder="Chọn ngày kết thúc"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
