import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  InputNumber,
  Typography,
  Space,
  Alert,
  Divider,
  Select,
} from 'antd';
import {
  PlusOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import SupplierSelector from './Components/SupplierSelector';
import CategorySelector from './Components/CategorySelector';
import ColorSelector from './Components/ColorSelector';
import { useCreateProduct } from './Hook/useCreateProduct';
import { toast } from 'react-toastify';
import { parseCurrency } from '@/Utils/ulti';
import type {
  ICreateProductRequest,
  ICreateProductResponse,
  ProductType,
} from '@/Interface/Product/ICreateProduct';

const { Title } = Typography;
const { TextArea } = Input;

const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'PAINT', label: 'Sơn' },
  { value: 'TOOL', label: 'Dụng cụ' },
  { value: 'CHEMICAL', label: 'Hóa chất' },
];

// Các field riêng theo từng loại, dùng để reset khi đổi productType
const TYPE_SPECIFIC_FIELDS = [
  'colorId',
  'surfaceType',
  'volume',
  'toolType',
  'toolSize',
  'chemicalType',
  'chemicalVolume',
] as const;

// Một cặp thông số bổ sung, nhập động trên FE
interface ExtraSpecItem {
  key: string;
  value: string;
}

// Shape của form: giống ICreateProductRequest, chỉ khác:
// - productImage là UploadFile[] (fileList antd) trong lúc nhập liệu, convert sang File[] lúc submit
// - extraSpecs không nhập trực tiếp dạng JSON string, mà nhập qua danh sách key/value (extraSpecsList),
//   rồi build thành JSON string lúc submit để khớp parseExtraSpecs(String) bên BE
type ProductFormData = Omit<ICreateProductRequest, 'productImage' | 'extraSpecs'> & {
  productImage: UploadFile[];
  extraSpecsList?: ExtraSpecItem[];
};

interface CreateProductProps {
  onSubmit?: (response: ICreateProductResponse) => void;
  onCancel?: () => void;
}

const CreateProductPage: React.FC<CreateProductProps> = ({
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductFormData>();
  const [imageFileList, setImageFileList] = React.useState<UploadFile[]>([]);

  // Theo dõi productType để render field tương ứng
  const productType = Form.useWatch('productType', form);
  // Theo dõi supplierId để pass xuống ColorSelector (ColorSelector tự fetch màu theo supplier)
  const supplierId = Form.useWatch('supplierId', form);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    onSuccess: (response) => {
      toast.success('Tạo sản phẩm thành công!');
      form.resetFields();
      setImageFileList([]);
      onSubmit?.(response.data);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(`Tạo sản phẩm thất bại! Vui lòng thử lại. - ${error}`);
    },
  });

  //?  Xử lý upload ảnh
  const handleImageUpload = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImageFileList(fileList);
  };

  //? Kiểm tra kích thước file (<= 2MB)
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isLt2M;
  };

  //? Khi đổi loại sản phẩm hoặc đổi nhà cung cấp, reset các field không còn hợp lệ
  const handleValuesChange = (changedValues: Partial<ProductFormData>) => {
    if ('productType' in changedValues) {
      const resetValues = TYPE_SPECIFIC_FIELDS.reduce(
        (acc, field) => ({ ...acc, [field]: undefined }),
        {} as Partial<ProductFormData>,
      );
      form.setFieldsValue(resetValues);
      return;
    }
    if ('supplierId' in changedValues) {
      // Màu sắc phụ thuộc nhà cung cấp -> đổi supplier thì màu đã chọn không còn hợp lệ
      form.setFieldsValue({ colorId: undefined });
    }
  };

  const onFinish = async (values: ProductFormData) => {
    if (imageFileList.length === 0) {
      message.error('Vui lòng chọn ít nhất một ảnh sản phẩm!');
      return;
    }

    const { extraSpecsList, ...rest } = values;

    // Build object từ danh sách key/value rồi stringify để khớp
    // parseExtraSpecs(String extraSpecsJson) bên BE
    const extraSpecsObject = (extraSpecsList ?? []).reduce<Record<string, string>>(
      (acc, item) => {
        if (item?.key) {
          acc[item.key] = item.value;
        }
        return acc;
      },
      {},
    );

    const submitData: ICreateProductRequest = {
      ...rest,
      extraSpecs:
        Object.keys(extraSpecsObject).length > 0
          ? JSON.stringify(extraSpecsObject)
          : undefined,
      productImage: imageFileList.map((file) => file.originFileObj as File),
    };

    createProduct(submitData);
  };

  //? Xử lý hủy: Quay về trang trước và gọi onCancel nếu có
  const handleCancel = () => {
    form.resetFields();
    setImageFileList([]);
    onCancel?.();
    navigate(-1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <Space className="mb-8 w-full flex justify-between items-center">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          size="large"
          className="shadow-sm"
          disabled={isCreating}
        >
          Quay lại
        </Button>
        <Title level={2} className="m-0 flex-1 text-center text-gray-800">
          Tạo Sản Phẩm Mới
        </Title>
        <div className="w-10" />
      </Space>

      {/* Form Card */}
      <Card className="max-w-5xl mx-auto shadow-lg" bordered={false}>
        <Alert
          message="Thông tin bắt buộc"
          description="Các trường có dấu * là bắt buộc. Ảnh sản phẩm phải ≤ 2MB và tối đa 5 ảnh."
          type="info"
          showIcon
          className="mb-6 rounded-md"
        />

        <Form
          form={form}
          name="createProduct"
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
          layout="vertical"
          size="large"
          disabled={isCreating}
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Thông tin cơ bản</Title>
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="productName"
                  label="Tên sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm đầy đủ" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="productCode"
                  label="Mã sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
                >
                  <Input placeholder="Nhập mã sản phẩm duy nhất" className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  name="productDescription"
                  label="Mô tả sản phẩm"
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập mô tả chi tiết sản phẩm, bao gồm tính năng nổi bật..."
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 2: Hình ảnh sản phẩm */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Hình ảnh sản phẩm</Title>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  name="productImage"
                  label="Ảnh sản phẩm *"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                  }}
                  rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={imageFileList}
                    onChange={handleImageUpload}
                    beforeUpload={beforeUpload}
                    maxCount={5}
                    accept="image/*"
                    className="rounded-md"
                  >
                    {imageFileList.length < 5 && (
                      <div className="flex flex-col items-center">
                        <PlusOutlined className="text-lg" />
                        <div className="mt-2 text-sm text-gray-600">Thêm ảnh</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 3: Phân loại sản phẩm - gồm Loại sản phẩm + Nhà cung cấp + Danh mục */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Phân loại sản phẩm</Title>
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="productType"
                  label="Loại sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm!' }]}
                >
                  <Select
                    placeholder="Chọn loại sản phẩm"
                    className="rounded-md"
                    options={PRODUCT_TYPE_OPTIONS}
                  />
                </Form.Item>
              </Col>
              <SupplierSelector form={form} />
              <CategorySelector form={form} />
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 4: Chi tiết theo loại sản phẩm - phụ thuộc productType (và supplierId cho màu sắc) đã chọn ở trên */}
          {productType && (
            <>
              <div className="mb-8">
                <Title level={4} className="mb-4 text-gray-700">
                  Chi tiết{' '}
                  {productType === 'PAINT' && '(Sơn)'}
                  {productType === 'TOOL' && '(Dụng cụ)'}
                  {productType === 'CHEMICAL' && '(Hóa chất)'}
                </Title>

                {productType === 'PAINT' && (
                  <Row gutter={24}>
                    {/* ColorSelector tự render Col + Form.Item(name="colorId") + fetch màu theo supplierId */}
                    <ColorSelector form={form} supplierId={supplierId} />
                    <Col xs={24} md={8}>
                      <Form.Item name="surfaceType" label="Loại bề mặt">
                        <Input placeholder="Ví dụ: Nội thất, ngoại thất" className="rounded-md" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="volume" label="Dung tích">
                        <Input placeholder="Ví dụ: 5L, 18L" className="rounded-md" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {productType === 'TOOL' && (
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item name="toolType" label="Loại dụng cụ">
                        <Input placeholder="Ví dụ: Cọ, rulo, súng phun" className="rounded-md" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="toolSize" label="Kích thước">
                        <Input placeholder="Ví dụ: 2 inch, 4 inch" className="rounded-md" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {productType === 'CHEMICAL' && (
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item name="chemicalType" label="Loại hóa chất">
                        <Input placeholder="Ví dụ: Dung môi, chất tẩy rửa" className="rounded-md" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="chemicalVolume" label="Dung tích">
                        <Input placeholder="Ví dụ: 1L, 5L" className="rounded-md" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item label="Thông số bổ sung">
                      <Form.List name="extraSpecsList">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Row gutter={12} key={key} align="middle" className="mb-2">
                                <Col xs={10}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'key']}
                                    rules={[{ required: true, message: 'Nhập tên thông số' }]}
                                    noStyle
                                  >
                                    <Input placeholder="Tên thông số (VD: doBong)" className="rounded-md" />
                                  </Form.Item>
                                </Col>
                                <Col xs={10}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'value']}
                                    rules={[{ required: true, message: 'Nhập giá trị' }]}
                                    noStyle
                                  >
                                    <Input placeholder="Giá trị (VD: Bóng mờ)" className="rounded-md" />
                                  </Form.Item>
                                </Col>
                                <Col xs={4} className="flex items-center">
                                  <Button
                                    type="text"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Col>
                              </Row>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              block
                            >
                              Thêm thông số
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <Divider className="my-8" />
            </>
          )}

          {/* Section 5: Giá cả và kho hàng */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Giá cả và kho hàng</Title>
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="productQuantity"
                  label="Số lượng tồn kho *"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    style={{ width: '100%' }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="productPrice"
                  label="Giá bán *"
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber
                    min={0}
                    precision={0}
                    placeholder="0"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={parseCurrency}
                    style={{ width: '100%' }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="discount" label="Giảm giá (%)">
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="0"
                    style={{ width: '100%' }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Buttons */}
          <Divider className="my-8" />
          <Row gutter={16} justify="end">
            <Col>
              <Space>
                <Button
                  onClick={handleCancel}
                  icon={<CloseOutlined />}
                  size="large"
                  className="shadow-sm"
                  disabled={isCreating}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  loading={isCreating}
                  size="large"
                  className="shadow-sm"
                >
                  Tạo Sản Phẩm
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProductPage;