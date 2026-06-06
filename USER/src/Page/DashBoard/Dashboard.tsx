import React, { useState, useEffect } from 'react';
import { message } from 'antd';
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
import { Box, Container, Typography } from '@mui/material';
import ProductSkeletonLoading from './Components/ProductSkeletonLoading';
import Grid from '@mui/material/Grid';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProductNewArrival();
  const newProducts = data?.data ?? [];

  const { id: userId } = useAuthStore();
  const { data: cartData, refetch: refetchCart } = useGetAllCarts(userId ?? '');
  const setCartCount = useCartStore((state) => state.setCartCount);

  useEffect(() => {
    if (cartData?.data?.items) {
      const count = cartData.data.items.reduce(
        (sum, item) => sum + item.product.productQuantity,
        0
      );
      setCartCount(count);
    }
  }, [cartData, setCartCount]);

  const addProductToCartMutation = useAddProductToCart(userId ?? '');

  const [addingProduct, setAddingProduct] = useState<{
    visible: boolean;
    productName?: string;
    status: 'loading' | 'success';
  }>({ visible: false, status: 'loading' });

  const handleAddToCart = (product: IGetProductNewArrival[0], quantity: number) => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      return;
    }
    setAddingProduct({ visible: true, productName: product.productName, status: 'loading' });
    addProductToCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          setAddingProduct((prev) => ({ ...prev, status: 'success' }));
          refetchCart();
          setTimeout(() => setAddingProduct({ visible: false, status: 'loading' }), 1000);
        },
        onError: (err) => {
          setAddingProduct({ visible: false, status: 'loading' });
          message.error(`Thêm thất bại: ${err.message || 'Lỗi không xác định'}`);
        },
      }
    );
  };

  const handleViewDetail = (productId: string) => navigate(`/products/${productId}`);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#F7F5F0', minHeight: '100vh' }}>
      {/* ── Hero Banner ── */}
      <BannerCarousel />

      {/* ── Section Header ── */}
      <Container maxWidth="xl" sx={{ pt: 8, pb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            pb: 3,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: '#b45309',
                fontWeight: 700,
                letterSpacing: '0.25em',
                display: 'block',
                mb: 0.5,
              }}
            >
              Bộ sưu tập 2025
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#1c1917',
                lineHeight: 1.1,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Sản Phẩm Mới Nhất
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.500',
              maxWidth: 280,
              textAlign: 'right',
              lineHeight: 1.7,
              display: { xs: 'none', md: 'block' },
            }}
          >
            Những dòng sơn cao cấp với màu sắc xu hướng và chất lượng vượt trội
          </Typography>
        </Box>
      </Container>

      {/* ── Product Grid ── */}
      <Container maxWidth="xl" sx={{ py: 5, pb: 12 }}>
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={i}>
                <ProductSkeletonLoading />
              </Grid>
            ))}
          </Grid>
        ) : newProducts.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 20,
              color: 'grey.400',
            }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              🎨
            </Typography>
            <Typography variant="h6">Chưa có sản phẩm mới nào</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {newProducts.map((product) => (
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.productId}>
                <ProductCardNewArrival
                  product={product}
                  onViewDetail={handleViewDetail}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <AddToCartModal
        visible={addingProduct.visible}
        productName={addingProduct.productName}
        status={addingProduct.status}
      />
    </Box>
  );
};

export default Dashboard;
