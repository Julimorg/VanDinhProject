import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Tag, Button, Spin, message, Badge, Grid } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useGetProductDetail } from "./Hook/useGetProductDetail";
import { useAuthStoreCookiesStorage } from "../../Middleware/useAuthStore";
import { useAddProductToCart } from "./Hook/useAddProductToCart";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const { data, isLoading, isError } = useGetProductDetail(id);
  const { id: userId } = useAuthStoreCookiesStorage();
  const addCartMutation = useAddProductToCart(userId ?? "");

  const product = data?.data;

  const handleAddToCart = () => {
    if (!userId) {
      message.error("Please log in to add products to your cart.");
      return;
    }

    addCartMutation.mutate(
      { productId: product!.productId, quantity: 1 },
      {
        onSuccess: () => message.success(`${product!.productName} added to cart.`),
        onError: () => message.error("Failed to add to cart."),
      }
    );
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );

  if (isError || !product)
    return (
      <div className="text-center mt-20">
        <Title level={3}>Product not found</Title>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* Back button */}
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/products")}
        className="mb-4"
      >
        Back to Products
      </Button>

      {/* Title */}
      <Title level={2} className="mb-4">
        {product.productName}
      </Title>

      <Row gutter={[32, 32]}>
        {/* LEFT: Image gallery */}
        <Col xs={24} md={12}>
          <Card hoverable className="p-3">
            {product.productImage.length > 0 ? (
              <img
                src={product.productImage[0]}
                alt={product.productName}
                className="w-full h-[350px] object-cover rounded-md"
              />
            ) : (
              <img
                src="https://via.placeholder.com/400x400?text=No+Image"
                className="w-full h-[350px] object-cover rounded-md"
              />
            )}

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.productImage.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="w-20 h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* RIGHT: Product Info */}
        <Col xs={24} md={12}>
          <Card className="p-4">
            <Title level={3}>${product.productPrice}</Title>

            <div className="my-3">
              <Tag color="blue">{product.categoryName}</Tag>
              <Tag color="default">{product.colorName}</Tag>
            </div>

            <Paragraph>
              <Text strong>Code:</Text> {product.productCode}
            </Paragraph>

            <Paragraph>
              <Text strong>Supplier:</Text> {product.supplierName}
            </Paragraph>

            <Paragraph>
              <Text strong>Volume:</Text> {product.productVolume} {product.productUnit}
            </Paragraph>

            <Paragraph>
              <Badge
                status={
                  product.productQuantity > 50
                    ? "success"
                    : product.productQuantity > 10
                    ? "warning"
                    : "error"
                }
                text={`${product.productQuantity} in stock`}
              />
            </Paragraph>

            <Button
              type="primary"
              size={screens.xs ? "middle" : "large"}
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={product.productQuantity === 0}
              block
            >
              Add to Cart
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Description */}
      <Card className="mt-8 p-6">
        <Title level={4}>Description</Title>
        <Paragraph className="text-gray-700 leading-7">
          {product.productDescription || "No description available."}
        </Paragraph>
      </Card>

    </div>
  );
};

export default ProductDetailPage;
