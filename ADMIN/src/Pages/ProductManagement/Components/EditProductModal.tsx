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
  Select,
  Divider,
  Descriptions,
  Tag,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  BarcodeOutlined,
  UserOutlined,
  FolderOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import SupplierSelector from './SupplierSelector';
import CategorySelector from './CategorySelector';
import ColorSelector from './ColorSelector';
import { useUpdateProduct } from '../Hook/useUpdateProduct';
import { IUpdateProductRequest } from '@/Interface/Product/IUpdateProduct';
import { toast } from 'react-toastify';
import { IGetProductDetailResponse } from '@/Interface/Product/IGetProductsDetail';
import { formatToVietnamTime } from '@/Utils/ulti';

const { Title, Text } = Typography;
const { TextArea } = Input;

// ---------- Types ----------

type ExtraSpecValue = string | number | boolean | null;

type EditableProduct = IGetProductDetailResponse & {
  supplierId?: string;
  categoryId?: string;
};

interface ExtraSpecEntry {
  key: string;
  value: string;
}

interface EditProductForm {
  productName: string;
  productDescription: string;
  productVolume: string;
  productUnit: string;
  productCode: string;
  productType: string;
  productQuantity: number;
  discount: number;
  productPrice: number;
  supplierId: string;
  categoryId: string;
  // PAINT
  colorId?: string;
  surfaceType?: string;
  volume?: string;
  // TOOL
  toolType?: string;
  toolSize?: string;
  // CHEMICAL
  chemicalType?: string;
  chemicalVolume?: string;
  // shared
  extraSpecsEntries?: ExtraSpecEntry[];
}

interface EditProductModalProps {
  visible: boolean;
  product?: EditableProduct;
  onCancel: () => void;
  onSave: (updatedProduct: EditableProduct) => void;
}

const PRODUCT_TYPE_OPTIONS = [
  { value: 'PAINT', label: 'Sơn' },
  { value: 'TOOL', label: 'Dụng cụ' },
  { value: 'CHEMICAL', label: 'Hóa chất' },
];

// ---------- Helpers ----------

const recordToEntries = (record?: Record<string, ExtraSpecValue> | null): ExtraSpecEntry[] =>
  record
    ? Object.entries(record).map(([key, value]) => ({
        key,
        value: value === null || value === undefined ? '' : String(value),
      }))
    : [];

const entriesToRecord = (entries?: ExtraSpecEntry[]): Record<string, string> => {
  const result: Record<string, string> = {};
  (entries || []).forEach(({ key, value }) => {
    if (key) result[key] = value ?? '';
  });
  return result;
};

// ---------- Reusable Extra Specs Form.List ----------

const ExtraSpecsFormList: React.FC = () => (
  <Form.List name="extraSpecsEntries">
    {(fields, { add, remove }) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Text type="secondary" className="text-sm">
            Thông số bổ sung
          </Text>
          <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => add({ key: '', value: '' })}>
            Thêm thông số
          </Button>
        </div>

        {fields.length === 0 && (
          <Text type="secondary" className="text-xs italic">
            Chưa có thông số nào — bấm "Thêm thông số" để thêm.
          </Text>
        )}

        {fields.map(({ key, name: fieldName, ...restField }) => (
          <Row gutter={8} key={key} align="middle">
            <Col span={10}>
              <Form.Item
                {...restField}
                name={[fieldName, 'key']}
                rules={[{ required: true, message: 'Nhập tên thông số' }]}
                className="!mb-2"
              >
                <Input placeholder="Tên thông số (VD: Độ bóng)" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item {...restField} name={[fieldName, 'value']} className="!mb-2">
                <Input placeholder="Giá trị (VD: Bóng mờ)" />
              </Form.Item>
            </Col>
            <Col span={3} className="flex justify-center">
              <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(fieldName)} />
            </Col>
          </Row>
        ))}
      </div>
    )}
  </Form.List>
);

// ---------- Main component ----------

const EditProductModal: React.FC<EditProductModalProps> = ({ visible, product, onCancel, onSave }) => {
  const [form] = Form.useForm<EditProductForm>();
  const [fileList, setFileList] = useState<any[]>([]);

  const productType = Form.useWatch('productType', form);
  const supplierId = Form.useWatch('supplierId', form);

  const updateProductMutation = useUpdateProduct(product?.productId || '', {
    onSuccess: (response) => {
      toast.success('Cập nhật sản phẩm thành công!');
      const updatedProduct = response.data as unknown as EditableProduct;
      onSave(updatedProduct);
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật sản phẩm: ${error.message}`);
    },
  });

  const loading = updateProductMutation.isPending;

  useEffect(() => {
    if (visible && product) {
      const activeDetail = product.paintDetail || product.toolDetail || product.chemicalDetail;

      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        productVolume: product.productVolume,
        productUnit: product.productUnit,
        productCode: product.productCode,
        productType: product.productType,
        productQuantity: product.productQuantity,
        discount: (product.discount || 0) * 100,
        productPrice: product.productPrice,
        supplierId: product.supplierId || '',
        categoryId: product.categoryId || '',

        colorId: product.paintDetail?.colorId || '',
        surfaceType: product.paintDetail?.surfaceType || '',
        volume: product.paintDetail?.volume || '',

        toolType: product.toolDetail ? String(product.toolDetail.toolType) : '',
        toolSize: product.toolDetail?.volume || '',

        chemicalType: product.chemicalDetail ? String(product.chemicalDetail.chemicalType) : '',
        chemicalVolume: product.chemicalDetail?.volume || '',

        extraSpecsEntries: recordToEntries(activeDetail?.extraSpecs),
      });

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
        productType: values.productType,
        productQuantity: values.productQuantity,
        discount: (values.discount || 0) / 100,
        productPrice: values.productPrice,
        supplierId: values.supplierId,
        categoryId: values.categoryId,
        extraSpecs: JSON.stringify(entriesToRecord(values.extraSpecsEntries)),
      };

      if (values.productType === 'PAINT') {
        body.colorId = values.colorId;
        body.surfaceType = values.surfaceType;
        body.volume = values.volume;
      } else if (values.productType === 'TOOL') {
        body.toolType = values.toolType;
        body.toolSize = values.toolSize;
      } else if (values.productType === 'CHEMICAL') {
        body.chemicalType = values.chemicalType;
        body.chemicalVolume = values.chemicalVolume;
      }

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

  // Snapshot màu hiện tại — chỉ để hiển thị tham khảo, không phải field submit
  // (BE tự resolve colorName/colorCode/hexCode lại từ colorId khi lưu)
  const currentColorSnapshot = product?.paintDetail;

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
        <Button key="save" type="primary" onClick={handleSubmit} loading={loading} disabled={loading}>
          Lưu Thay Đổi
        </Button>,
      ]}
      width={800}
      centered
      destroyOnClose
      bodyStyle={{ maxHeight: '75vh', overflow: 'auto', padding: '24px' }}
    >
      {/* ---------- Thông tin hiện tại (read-only) — hiển thị đầy đủ mọi field
           ProductDetail có, kể cả field không cho sửa trực tiếp ở đây ---------- */}
      {product && (
        <Descriptions
          size="small"
          column={{ xs: 1, sm: 2 }}
          bordered
          className="!mb-5"
          labelStyle={{ width: 140 }}
        >
          <Descriptions.Item label={<Text type="secondary"><BarcodeOutlined /> Mã ID</Text>} span={2}>
            <Text copyable className="text-xs">
              {product.productId}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary"><UserOutlined /> Nhà cung cấp</Text>}>
            {product.supplierName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary"><FolderOutlined /> Danh mục</Text>}>
            {product.categoryName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary"><CalendarOutlined /> Tạo lúc</Text>}>
            {formatToVietnamTime(product.createAt)}
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary"><CalendarOutlined /> Cập nhật lúc</Text>}>
            {formatToVietnamTime(product.updateAt)}
          </Descriptions.Item>
          {product.colorName && (
            <Descriptions.Item label="Màu (tổng quan)" span={2}>
              <Tag color="geekblue">{product.colorName}</Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}

      <Form form={form} layout="vertical" initialValues={{}} className="space-y-4">
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
            <Form.Item
              name="productQuantity"
              label="Số Lượng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
            >
              <InputNumber min={1} placeholder="0" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="discount" label="Giảm Giá (%)">
              <InputNumber min={0} max={100} step={0.1} placeholder="0" style={{ width: '100%' }} formatter={(value) => `${value}%`} />
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
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <SupplierSelector form={form} />
          <CategorySelector form={form} />
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="productType"
              label="Loại Sản Phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
            >
              <Select placeholder="Chọn loại sản phẩm" options={PRODUCT_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        {productType === 'PAINT' && (
          <>
            <Divider orientation="left" orientationMargin={0} className="!my-2">
              Chi tiết Sơn
            </Divider>

            {currentColorSnapshot && (
              <div className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
                <span
                  className="inline-block w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: currentColorSnapshot.hexCode || '#ffffff' }}
                />
                <Text type="secondary" className="text-xs">
                  Màu hiện tại: <Text strong className="text-xs">{currentColorSnapshot.colorName}</Text> (Mã:{' '}
                  {currentColorSnapshot.colorCode}, Hex: {currentColorSnapshot.hexCode})
                </Text>
              </div>
            )}

            <Row gutter={16}>
              <ColorSelector form={form} supplierId={supplierId} />
              <Col span={12}>
                <Form.Item name="surfaceType" label="Bề Mặt">
                  <Input placeholder="Ví dụ: Nội thất / Ngoại thất" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="volume" label="Dung Tích (chi tiết)">
                  <Input placeholder="Ví dụ: 5L" />
                </Form.Item>
              </Col>
            </Row>
            <ExtraSpecsFormList />
          </>
        )}

        {productType === 'TOOL' && (
          <>
            <Divider orientation="left" orientationMargin={0} className="!my-2">
              Chi tiết Dụng Cụ
            </Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="toolType"
                  label="Loại Dụng Cụ"
                  rules={[{ required: true, message: 'Vui lòng nhập loại dụng cụ!' }]}
                >
                  <Input placeholder="Ví dụ: Cọ lăn, Bay trét..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="toolSize" label="Kích Thước">
                  <Input placeholder="Ví dụ: 25cm" />
                </Form.Item>
              </Col>
            </Row>
            <ExtraSpecsFormList />
          </>
        )}

        {productType === 'CHEMICAL' && (
          <>
            <Divider orientation="left" orientationMargin={0} className="!my-2">
              Chi tiết Hóa Chất
            </Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="chemicalType"
                  label="Loại Hóa Chất"
                  rules={[{ required: true, message: 'Vui lòng nhập loại hóa chất!' }]}
                >
                  <Input placeholder="Ví dụ: Chống thấm, Bột trét..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="chemicalVolume" label="Dung Tích">
                  <Input placeholder="Ví dụ: 20kg" />
                </Form.Item>
              </Col>
            </Row>
            <ExtraSpecsFormList />
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditProductModal;