// File: src/components/Color/EditColorModal.tsx
import React from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import type { Color } from './ColorList'; // Giả sử import Color interface từ ColorList
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

interface EditColorModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    colorId: string;
    colorName: string;
    colorCode: string;
    colorDescription: string;
    // colorImg: string;
    supplierId: string;
  }) => void;
  color: Color;
  suppliers: IGetSupplierSelectionResponse[];
}

const EditColorModal: React.FC<EditColorModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  color,
  suppliers,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && color) {
      form.setFieldsValue({
        colorId: color.colorId,
        colorName: color.colorName,
        colorCode: color.colorCode,
        colorDescription: color.colorDescription,
        supplierId: color.supplierName ? suppliers.find(s => s.supplierName === color.supplierName)?.supplierId : undefined,
      });
    }
  }, [visible, color, form, suppliers]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, colorId: color.colorId });
      form.resetFields();
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title="Chỉnh sửa mã màu"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
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
        <Form.Item
          name="colorImg"
          label="Hình ảnh màu"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload
            name="colorImg"
            listType="picture"
            accept="image/*"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Chọn file hình ảnh mới (tùy chọn)</Button>
          </Upload>
          {/* {color.colorImg && <div>Hình ảnh hiện tại: <img src={color.colorImg} alt={color.colorName} style={{ width: '50px', height: '50px' }} /></div>} */}
        </Form.Item>
        <Form.Item
          name="supplierId"
          label="Nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
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

export default EditColorModal;