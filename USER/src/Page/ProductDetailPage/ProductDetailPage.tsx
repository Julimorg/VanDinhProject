import { useAuthStore } from "@/Middleware/useAuthStoreWithLocal";
import { useCartStore } from "@/Middleware/useCartStore";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddProductToCart } from "../ProductPage/Hook/useAddProductToCart";
import ProductActions from "./Components/ProductAction";
import ProductBreadcrumb from "./Components/ProductBreadCrumb";
import { useGetProductDetail } from "./Hook/useGetProductDetail";
import ProductDetailInfo from "./Components/ProductDetailInfo";
import ProductExtraSpecs from "./Components/ProductExtraSpecs";
import ProductSupplierInfo from "./Components/ProductSupplierInfo";
import type { PublicProductDetail } from "@/Interface/Product/IGetProductsDetail";
import ProductAboutCard from "./Components/ProductAboutCard";
import ProductGallery from "./Components/ProductGallery";
import ProductOverviewInfo from "./Components/ProductOverviewInfo";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { id: userId } = useAuthStore();
  const { data, isLoading, isError } = useGetProductDetail(id);
  const addCartMutation = useAddProductToCart(userId ?? '');
  const setCartCount = useCartStore((state) => state.setCartCount);

  const [quantity, setQuantity] = React.useState(1);
  const [previewImage, setPreviewImage] = React.useState('');

  const product = data?.data as unknown as PublicProductDetail | undefined;

  const handleAddToCart = () => {
    if (!userId) return toast.error('Vui lòng đăng nhập!');
    if (!product) return;

    addCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          toast.success(`${product.productName} đã thêm vào giỏ!`);
          setCartCount(useCartStore.getState().cartCount + quantity);
        },
        onError: () => toast.error('Thêm thất bại!'),
      }
    );
  };

  if (isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20 px-4">
        <Button variant="contained" size="large" onClick={() => navigate('/products')}>
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.productQuantity === 0;
  const activeDetail = product.paintDetail || product.toolDetail || product.chemicalDetail;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <ProductBreadcrumb categoryName={product.categoryName} productName={product.productName} />

        {/* Card tổng quan: ảnh | thông tin + giá + list + nút mua */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5, lg: 5 }}>
              <ProductGallery
                images={product.productImage}
                productName={product.productName}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 7, lg: 7 }}>
              <ProductOverviewInfo
                productName={product.productName}
                supplierName={product.supplierName}
                productPrice={product.productPrice}
                productQuantity={product.productQuantity}
                productCode={product.productCode}
                categoryName={product.categoryName}
                productVolume={product.paintDetail?.volume || product.productVolume}
                productUnit={product.productUnit}
                discount={product.discount}
                soldCount={product.soldCount}
                colorName={product.paintDetail?.colorName || product.colorName}
                colorCode={product.paintDetail?.hexCode || product.colorCode}
              />

              <div className="mt-5 sm:mt-6">
                <ProductActions
                  quantity={quantity}
                  setQuantity={setQuantity}
                  productQuantity={product.productQuantity}
                  isOutOfStock={isOutOfStock}
                  onAddToCart={handleAddToCart}
                  isPending={addCartMutation.isPending}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        {/* Hàng 3 card: About | Chi tiết loại | Supplier — 3 cột desktop, 2 cột tablet, 1 cột mobile */}
        <Grid container spacing={2} className="mt-4 sm:mt-6">
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <ProductAboutCard description={product.productDescription} />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <ProductDetailInfo
              paintDetail={product.paintDetail}
              toolDetail={product.toolDetail}
              chemicalDetail={product.chemicalDetail}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
            <ProductSupplierInfo
              supplierName={product.supplierName}
              categoryName={product.categoryName}
              productQuantity={product.productQuantity}
              createAt={product.createAt}
              updateAt={product.updateAt}
            />
          </Grid>
        </Grid>

        {/* Extra Specifications — full width, 3 cột */}
        <div className="mt-4 sm:mt-6">
          <ProductExtraSpecs data={activeDetail?.extraSpecs} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
