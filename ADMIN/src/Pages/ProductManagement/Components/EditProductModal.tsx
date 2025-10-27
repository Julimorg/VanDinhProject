import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
  Typography,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import SupplierSelector from './SupplierSelector';
import CategorySelector from './CategorySelector';
import { useUpdateProduct } from '../Hook/useUpdateProduct';
import { IUpdateProductRequest } from '@/Interface/Product/IUpdateProduct';
import { toast } from 'react-toastify';


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
  productPrice: number;
  supplierName: string;
  supplierId?: string;
  colorName: string;
  colorId?: string;
  categoryName: string;
  categoryId?: string;
  createAt: string;
  updateAt: string;
}

const { Title } = Typography;
const { TextArea } = Input;

// Interface cho form values
interface EditProductForm {
  productName: string;
  productDescription: string;
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number; // % để input
  productPrice: number;
  supplierId: string;
  colorId: string;
  categoryId: string;
}

// Props cho EditProductModal
interface EditProductModalProps {
  visible: boolean;
  product?: Product;
  onCancel: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm<EditProductForm>();
  const [fileList, setFileList] = useState<any[]>([]);


  const updateProductMutation = useUpdateProduct(
    product?.productId || '',
    {
      onSuccess: (response) => {
        toast.success('Cập nhật sản phẩm thành công!');
        // Chuyển response data thành Product để gọi onSave (map productImage nếu cần, nhưng cast tạm)
        const updatedProduct = response.data as unknown as Product;
        onSave(updatedProduct);
      },
      onError: (error: Error) => {
        toast.error(`Lỗi cập nhật sản phẩm: ${error.message}`);
      },
    }
  );

  const loading = updateProductMutation.isPending;

  // Khởi tạo form với data từ product
  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        productVolume: product.productVolume,
        productUnit: product.productUnit,
        productCode: product.productCode,
        productQuantity: product.productQuantity,
        discount: product.discount * 100, // Hiển thị %
        productPrice: product.productPrice,
        supplierId: product.supplierId || '',
        colorId: product.colorId || '',
        categoryId: product.categoryId || '',
      });

      // Preview images hiện tại
      const currentImages = (product.productImage || []).map((url: string, index: number) => ({
        uid: `-${index}`,
        name: `image-${index + 1}.png`,
        status: 'done' as const,
        url,
      }));
      setFileList(currentImages);
    } else if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, product, form]);

  // Xử lý upload change (kiểm tra size <= 2MB)
  const handleUploadChange = ({ fileList: newFileList }: UploadChangeParam) => {
    const filteredList = newFileList
      .map((file) => {
        if (file.originFileObj && (file.originFileObj as RcFile).size! > 2 * 1024 * 1024) {
          message.error('File phải nhỏ hơn hoặc bằng 2MB!');
          return null;
        }
        return file;
      })
      .filter(Boolean) as any[];

    setFileList(filteredList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      //? Xử lý images: Chỉ lấy files mới (originFileObj) cho upload
      const newFiles: File[] = fileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      const body: IUpdateProductRequest = {
        productName: values.productName,
        productDescription: values.productDescription,
        productImage: newFiles, 
        productVolume: values.productVolume,
        productUnit: values.productUnit,
        productCode: values.productCode,
        productQuantity: values.productQuantity,
        discount: values.discount / 100, 
        productPrice: values.productPrice,
        supplierId: values.supplierId,
        colorId: values.colorId,
        categoryId: values.categoryId,
      };
      await updateProductMutation.mutateAsync(body);
    } catch (error) {

      toast.error(`Lỗi cập nhật - ${error}`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={
        <Title level={4} className="m-0 text-gray-900">
          Chỉnh Sửa Sản Phẩm
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Lưu Thay Đổi
        </Button>,
      ]}
      width={800}
      centered
      destroyOnClose
      bodyStyle={{ 
        maxHeight: '70vh',
        overflow: 'auto', 
        padding: '24px', 
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        className="space-y-4"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="productName"
              label="Tên Sản Phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="productDescription"
              label="Mô Tả Sản Phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả chi tiết sản phẩm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Hình Ảnh Sản Phẩm (≤ 2MB/file)">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} 
                maxCount={10}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="productVolume" label="Dung Lượng">
              <Input placeholder="Ví dụ: 330ml" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="productUnit" label="Đơn Vị">
              <Input placeholder="Ví dụ: Lon" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="productCode" label="Mã Code">
              <Input placeholder="Nhập mã code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="productQuantity" label="Số Lượng">
              <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="discount" label="Giảm Giá (%)">
              <InputNumber
                min={0}
                max={100}
                step={0.1}
                placeholder="0"
                style={{ width: '100%' }}
                formatter={(value) => `${value}%`}
                // parser={(value) => value!.replace('%', '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="productPrice"
              label="Giá Sản Phẩm (VND)"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: '100%' }}
                formatter={(value) => `${value?.toLocaleString('vi-VN')}`}
                // parser={(value) => parseInt(value!.replace(/\D/g, '')) || 0}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row cho Supplier, Color, Category với selectors - Giống CreateProduct */}
        <Row gutter={16}>
            <SupplierSelector form={form} />   
            <CategorySelector form={form} />
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProductModal;