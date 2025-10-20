// EditProductModal.tsx - File component riêng cho Modal Edit
import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

// Interface giống Product
interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number;
  productPrice: string;
  supplierName: string;
  colorName: string;
  categoryName: string;
  createAt: string;
  updateAt: string;
}

interface EditProductModalProps {
  visible: boolean;
  product: Product;
  onCancel: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ visible, product, onCancel, onSave }) => {
  const [form] = Form.useForm<Product>();

  React.useEffect(() => {
    if (visible && product) {
      form.setFieldsValue(product);
    }
  }, [visible, product, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedProduct: Product = { ...product, ...values, updateAt: new Date().toISOString() };
        onSave(updatedProduct);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Chỉnh Sửa Sản Phẩm"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      okText="Lưu Thay Đổi"
      cancelText="Hủy"
      style={{ top: 20 }} // Điều chỉnh vị trí modal nếu cần
      bodyStyle={{ 
        maxHeight: '70vh', // Giới hạn chiều cao modal
        overflowY: 'auto' // Thêm scroll vertical cho body modal
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={product}
        style={{ padding: '16px 0' }} // Thêm padding cho form
      >
        <Form.Item
          name="productName"
          label="Tên Sản Phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="productDescription"
          label="Mô Tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          name="productVolume"
          label="Dung Lượng"
          rules={[{ required: true, message: 'Vui lòng nhập dung lượng!' }]}
        >
          <Input placeholder="Ví dụ: 330ml" />
        </Form.Item>

        <Form.Item
          name="productUnit"
          label="Đơn Vị"
          rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
        >
          <Input placeholder="Ví dụ: Lon" />
        </Form.Item>

        <Form.Item
          name="productCode"
          label="Mã Code"
          rules={[{ required: true, message: 'Vui lòng nhập mã code!' }]}
        >
          <Input placeholder="Nhập mã code" />
        </Form.Item>

        <Form.Item
          name="productQuantity"
          label="Số Lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={0} placeholder="Nhập số lượng" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="productPrice"
          label="Giá Sản Phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
        >
          <InputNumber 
            min={0} 
            precision={2} 
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập giá (VND)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Giảm Giá (%)"
          rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}
        >
          <InputNumber 
            min={0} 
            max={100} 
            step={0.1}
            placeholder="Nhập % giảm (0-100)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="supplierName"
          label="Nhà Cung Cấp"
          rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="colorName"
          label="Màu Sắc"
          rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>

        <Form.Item
          name="categoryName"
          label="Danh Mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục">
            <Option value="Sách">Sách</Option>
            <Option value="Điện Tử">Điện Tử</Option>
            <Option value="Thực Phẩm">Thực Phẩm</Option>
            {/* Thêm options khác nếu cần */}
          </Select>
        </Form.Item>

        {/* Lưu ý: productImage, createAt, updateAt không edit ở đây để đơn giản */}
      </Form>
    </Modal>
  );
};

export default EditProductModal;