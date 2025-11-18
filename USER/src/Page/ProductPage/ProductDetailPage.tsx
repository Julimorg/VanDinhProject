import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Spin,
  message,
  Image,
  Space,
  Divider,
  Breadcrumb,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  ShareAltOutlined,
  PlusOutlined,
  MinusOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useGetProductDetail } from "./Hook/useGetProductDetail";
import { useAuthStoreCookiesStorage } from "../../Middleware/useAuthStore";
import { useAddProductToCart } from "./Hook/useAddProductToCart";
import { toast } from "react-toastify";
import { useCartStore } from "../../Middleware/useCartStore";
import { HomeOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetProductDetail(id);
  const { id: userId } = useAuthStoreCookiesStorage();
  const addCartMutation = useAddProductToCart(userId ?? "");
  const [quantity, setQuantity] = React.useState<number>(1);
  const setCartCount = useCartStore((state) => state.setCartCount);

  const product = data?.data;
  const [previewImage, setPreviewImage] = React.useState<string>("");

  React.useEffect(() => {
    if (product?.productImage && product.productImage.length > 0) {
      setPreviewImage(product.productImage[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!userId) {
      message.error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    addCartMutation.mutate(
      { productId: product!.productId, quantity },
      {
        onSuccess: () => {
          toast.success(`${product!.productName} (${quantity}) đã được thêm vào giỏ hàng!`);
          const cartCount = useCartStore.getState().cartCount;
          setCartCount(cartCount + quantity);
          refetch();
        },
        onError: () => message.error("Thêm vào giỏ hàng thất bại."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Title level={2} type="danger">
          Không tìm thấy sản phẩm
        </Title>
        <Button type="primary" size="large" onClick={() => navigate("/products")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.productQuantity === 0;
  const isLowStock = product.productQuantity > 0 && product.productQuantity <= 10;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: 24 }} separator=">">
          <Breadcrumb.Item key="home" onClick={() => navigate('/')}>
            <span style={{ cursor: 'pointer' }}>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item key="products" onClick={() => navigate('/products')}>
            <span style={{ cursor: 'pointer' }}>Products</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item key="current">
            {product.productName.length > 30 ? product.productName.slice(0, 30) + '...' : product.productName}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[40, 40]}>
          {/* LEFT: Image Gallery */}
          <Col xs={24} lg={12}>
            <div className="sticky top-6 space-y-4">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white">
                <Image
                  src={previewImage || "https://via.placeholder.com/800"}
                  alt={product.productName}
                  preview={{ src: previewImage }}
                  className="w-full aspect-square object-cover"
                  fallback="https://via.placeholder.com/800?text=No+Image"
                />

                {/* Action Icons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                  <Button type="text" shape="circle" icon={<HeartOutlined />} className="bg-white shadow-md hover:shadow-lg" />
                  <Button type="text" shape="circle" icon={<ShareAltOutlined />} className="bg-white shadow-md hover:shadow-lg" />
                </div>
              </div>

              {/* Thumbnails */}
              {product.productImage.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.productImage.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setPreviewImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${previewImage === img
                        ? "border-blue-600 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* RIGHT: Product Info */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" className="w-full">

              {/* Brand & Title */}
              <div>
                <Title level={1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" style={{ margin: 0 }}>
                  {product.productName}
                </Title>
                <Text className="text-lg text-gray-600 font-medium" >{product.supplierName}</Text>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center gap-6">
                <Title level={2} className="text-4xl font-bold text-gray-900 m-0" style={{ margin: 0 }}>
                  ${product.productPrice.toLocaleString()}
                </Title>

                {isOutOfStock ? (
                  <Tag color="red" className="text-base px-5 py-1.5 font-medium text-lg">Hết hàng</Tag>
                ) : isLowStock ? (
                  <Tag color="orange" icon={<AlertOutlined />} className="text-base px-5 py-1.5 font-medium text-lg" >
                    Chỉ còn {product.productQuantity} sản phẩm
                  </Tag>
                ) : (
                  <Tag color="green" className="text-base px-5 py-1.5 font-medium text-lg">
                    Còn hàng
                  </Tag>
                )}
              </div>
              <Divider className="" style={{ margin: 0 }} />

              {/* Color Selector - Nếu có */}
              {product.colorName && (
                <div className="mt-4">
                  <Text strong className="text-gray-700 text-base block mb-2">
                    Màu sắc: <span className="font-medium">{product.colorName}</span>
                  </Text>
                  <Space size="middle">
                    {/* Lấy colorCode từ DB */}
                    {(() => {
                      const validHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                      const color = product.colorCode && validHex.test(product.colorCode)
                        ? product.colorCode
                        : "#ccc"; // placeholder nếu không hợp lệ

                      return (
                        <div
                          className="w-12 h-12 rounded-full border-4 border-gray-300 shadow-lg cursor-pointer"
                          style={{ backgroundColor: color }}
                        ></div>
                      );
                    })()}
                  </Space>
                </div>
              )}


              {/* Size Selector - Giả lập (bạn có thể thay bằng data thật sau) */}
              {/* Description */}
              <div>
                <Title level={4} className="mb-4 text-gray-800">Mô tả sản phẩm</Title>
                <Paragraph className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.productDescription || "Không có mô tả chi tiết cho sản phẩm này."}
                </Paragraph>
              </div>



              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <Button
                    type="text"
                    size="large"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="hover:bg-gray-50"
                  >
                    <MinusOutlined />
                  </Button>
                  <div className="px-6 font-bold text-lg min-w-20 text-center">{quantity}</div>
                  <Button
                    type="text"
                    size="large"
                    onClick={() => setQuantity(Math.min(product.productQuantity, quantity + 1))}
                    disabled={quantity >= product.productQuantity || isOutOfStock}
                    className="hover:bg-gray-50"
                  >
                    <PlusOutlined />
                  </Button>
                </div>

                {/* Add to Cart */}
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  loading={addCartMutation.isPending}
                  className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl"
                  style={{
                    background: isOutOfStock ? "#f5f5f5" : "#000",
                    border: "none",
                    color: "white",
                  }}
                >
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </Button>
              </div>

              {/* Low stock warning */}
              {isLowStock && !isOutOfStock && (
                <div className="mt-4 text-orange-600 font-medium flex items-center gap-2">
                  <AlertOutlined />
                  <span>Hurry! Chỉ còn {product.productQuantity} sản phẩm – Đặt ngay!</span>
                </div>
              )}




            </Space>
          </Col>
          <Divider className="my-8" />
        </Row>
      </div>
    </div>
  );
};

export default ProductDetailPage;