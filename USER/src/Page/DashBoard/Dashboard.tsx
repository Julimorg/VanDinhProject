import React, { useState, useEffect } from 'react';
import { Row, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetProductNewArrival } from './Hooks/useGetProductNewArrival';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';
import { useCartStore } from '../../Middleware/useCartStore';
import { useGetAllCarts } from '../CartPage/Hook/useGetAllCarts';
import { useAddProductToCart } from '../ProductPage/Hook/useAddProductToCart';
import type { IGetProductNewArrival } from '../../Interface/Product/IGetProductNewArrival';
import BannerCarousel from './Components/BannerCarousel';
import ProductCardNewArrival from './Components/ProductCardNewArrival';
import AddToCartModal from '../ProductPage/Components/AddToCartModel';
import ProductSkeletonLoading from './Components/ProductSkeletonLoading';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProductNewArrival();
  const newProducts = data?.data ?? [];

  const { id: userId } = useAuthStore();
  const { data: cartData, refetch: refetchCart } = useGetAllCarts(userId ?? '');
  const setCartCount = useCartStore((state) => state.setCartCount);

  useEffect(() => {
    if (cartData?.data?.items) {
      const count = cartData.data.items.reduce((sum, item) => sum + item.product.productQuantity, 0);
      setCartCount(count);
    }
  }, [cartData, setCartCount]);

  const addProductToCartMutation = useAddProductToCart(userId ?? '');

  const [addingProduct, setAddingProduct] = useState<{
    visible: boolean;
    productName?: string;
    status: 'loading' | 'success';
  }>({
    visible: false,
    status: 'loading',
  });

  const handleAddToCart = (product: IGetProductNewArrival[0], quantity: number) => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    setAddingProduct({
      visible: true,
      productName: product.productName,
      status: 'loading',
    });

    addProductToCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          setAddingProduct((prev) => ({
            ...prev,
            status: 'success',
          }));
          refetchCart();

          setTimeout(() => {
            setAddingProduct({
              visible: false,
              status: 'loading',
            });
          }, 1000);
        },
        onError: (err) => {
          setAddingProduct({
            visible: false,
            status: 'loading',
          });
          message.error(`Thêm thất bại: ${err.message || 'Lỗi không xác định'}`);
        }
      }
    );
  };

  const handleViewDetail = (productId: string) => navigate(`/products/${productId}`);

  return (
    <div className="flex-1 bg-gray-50/70 min-h-screen pb-16">
      {/* Banner */}
      <BannerCarousel />

      {/* Title - tăng padding để thoáng */}
      <div className="px-6 md:px-10 lg:px-16 py-12 text-center">
        <Title level={2} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sản Phẩm Mới Nhất
        </Title>
        <Text className="text-xl text-gray-600 block max-w-3xl mx-auto">
          Khám phá những dòng sơn mới nhất, màu sắc xu hướng và chất lượng vượt trội 2025
        </Text>
      </div>

      {/* Product Grid - tăng gutter và padding để thoáng đãng hơn */}
      {isLoading ? (
        <div className="px-6 md:px-10 lg:px-16 py-8">
          <Row gutter={[24, 32]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeletonLoading key={i} />
            ))}
          </Row>
        </div>
      ) : newProducts.length === 0 ? (
        <div className="text-center py-20">
          <Text className="text-xl text-gray-600">Chưa có sản phẩm mới nào</Text>
        </div>
      ) : (
        <div className="px-6 md:px-10 lg:px-16">
          <Row gutter={[24, 32]}>
            {newProducts.map((product) => (
              <ProductCardNewArrival
                key={product.productId}
                product={product}
                onViewDetail={handleViewDetail}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Row>
        </div>
      )}

      <AddToCartModal
        visible={addingProduct.visible}
        productName={addingProduct.productName}
        status={addingProduct.status}
      />
    </div>
  );
};

export default Dashboard;