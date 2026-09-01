import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import TextArea from 'antd/es/input/TextArea';
import { useUploadImgFile } from '@/Hook/useUploadImgFile';
import { toast } from 'react-toastify';
import { useCreateColor } from '../hooks/useCreateColor';

const { Option } = Select;

interface AddColorModalProps {
  visible: boolean;
  onCancel: () => void;
  suppliers: IGetSupplierSelectionResponse[];
  onAddSuccess?: () => void;
  defaultSupplierId?: string; 
  lockSupplierSelect?: boolean;
}

const AddColorModal: React.FC<AddColorModalProps> = ({
  visible,
  onCancel,
  suppliers,
  onAddSuccess,
  defaultSupplierId,
  lockSupplierSelect = false,
}) => {
  const [form] = Form.useForm();

  const { uploadProps, getCurrentFile, reset } = useUploadImgFile({
    maxCount: 1,
  });

  const createColorMutation = useCreateColor({
    onSuccess: (response) => {
      toast.success(`Thêm mã màu - ${response.message} !`);
      handleClose();
      onAddSuccess?.();
    },
    onError: (error) => {
      toast.error(`Thêm mã màu thất bại: ${error.message || 'Vui lòng thử lại!'}`);
    },
  });

  //? Mỗi lần mở modal, nếu có defaultSupplierId thì set sẵn vào form
  useEffect(() => {
    if (visible && defaultSupplierId) {
      form.setFieldsValue({ supplierId: defaultSupplierId });
    }
  }, [visible, defaultSupplierId, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const colorImg = getCurrentFile();
      if (!colorImg) {
        message.error('Vui lòng chọn hình ảnh màu!');
        return;
      }
      const requestBody = {
        ...values,
        colorImg,
      };
      createColorMutation.mutate(requestBody);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleClose = () => {
    form.resetFields();
    reset();
    onCancel();
  };

  return (
    <Modal
      title="Thêm mã màu mới"
      open={visible}
      onOk={handleOk}
      onCancel={handleClose}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={createColorMutation.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="colorName"
          label="Tên màu"
          rules={[{ required: true, message: 'Vui lòng nhập tên màu!' }]}
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>
        <Form.Item
          name="colorCode"
          label="Mã màu"
          rules={[{ required: true, message: 'Vui lòng nhập mã màu!' }]}
        >
          <Input placeholder="Nhập mã màu (ví dụ: #FF0000)" />
        </Form.Item>
        <Form.Item
          name="colorDescription"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TextArea rows={3} placeholder="Nhập mô tả màu" />
        </Form.Item>
        <Form.Item label="Hình ảnh màu">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn file hình ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Ẩn field chọn supplier khi đã có sẵn context (đang ở SupplierDetailPage) */}
        <Form.Item
          name="supplierId"
          label="Nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
          hidden={lockSupplierSelect}
        >
          <Select placeholder="Chọn nhà cung cấp">
            {suppliers.map((supplier) => (
              <Option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.supplierName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColorModal;