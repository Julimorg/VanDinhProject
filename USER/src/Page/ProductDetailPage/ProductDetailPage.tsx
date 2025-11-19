
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, Button, message } from 'antd';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import { useCartStore } from '../../Middleware/useCartStore';
import { toast } from 'react-toastify';
import ProductBreadcrumb from './Components/ProductBreadCrumb';
import ProductGallery from './Components/ProductGallery';
import ProductInfoHeader from './Components/ProductInfoHeader';
import ProductDescription from './Components/ProductDescription';
import ProductActions from './Components/ProductAction';
import { useGetProductDetail } from './Hook/useGetProductDetail';
import { useAddProductToCart } from '../ProductPage/Hook/useAddProductToCart';


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { id: userId } = useAuthStoreCookiesStorage();
  const { data, isLoading, isError } = useGetProductDetail(id);
  const addCartMutation = useAddProductToCart(userId ?? '');
  const setCartCount = useCartStore((state) => state.setCartCount);

  const [quantity, setQuantity] = React.useState(1);
  const [previewImage, setPreviewImage] = React.useState('');

  const product = data?.data;

  const handleAddToCart = () => {
    if (!userId) return message.error('Vui lòng đăng nhập!');
    if (!product) return;

    addCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          toast.success(`${product.productName} đã thêm vào giỏ!`);
          setCartCount(useCartStore.getState().cartCount + quantity);
        },
        onError: () => message.error('Thêm thất bại!'),
      }
    );
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spin size="large" tip="Đang tải..." /></div>;
  if (isError || !product) return <div className="text-center py-20"><Button type="primary" size="large" onClick={() => navigate('/products')}>Quay lại danh sách sản phẩm</Button></div>;

  const isOutOfStock = product.productQuantity === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductBreadcrumb productName={product.productName} />

        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <ProductGallery
              images={product.productImage}
              productName={product.productName}
              previewImage={previewImage}
              setPreviewImage={setPreviewImage}
            />
          </Col>

          <Col xs={24} lg={12}>
            <ProductInfoHeader
              productName={product.productName}
              supplierName={product.supplierName}
              productPrice={product.productPrice}
              productQuantity={product.productQuantity}
              colorName={product.colorName}
              colorCode={product.colorCode}
            />

            <ProductDescription description={product.productDescription} />

            <ProductActions
              quantity={quantity}
              setQuantity={setQuantity}
              productQuantity={product.productQuantity}
              isOutOfStock={isOutOfStock}
              onAddToCart={handleAddToCart}
              isPending={addCartMutation.isPending}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetailPage;