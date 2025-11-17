import React, { useState, useMemo } from 'react';
import { Pagination, Badge, message, Typography, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import SearchBar from './Components/SearchBar';
import FilterBar from './Components/FilterButton';
import ViewToggle from './Components/ViewToggle';
import ProductCard from './Components/ProductCard';

import { useGetAllProducts } from './Hook/useGetAllProducts';
import type { IGetAllProductResponse } from '../../Interface/Product/IGetAllProducts';
import { useGetSupplierSelections } from './Hook/useGetSupplierSelection';
import { useGetCategorySelection } from './Hook/useGetCategorySelection';
import type { IGetCategorySelectionResponse } from '../../Interface/Category/IGetCategorySelection';
import type { IGetSupplierSelectionResponse } from '../../Interface/Supplier/IGetSupplierSelection';
import { useAuthStoreCookiesStorage } from '../../Middleware/useAuthStore';
import { useAddProductToCart } from './Hook/useAddProductToCart';
import { toast } from 'react-toastify';
import { useGetAllCarts } from './Hook/useGetAllCarts';
const { Title, Paragraph } = Typography;
const pageSize = 12;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname !== '/products';

  // === State cho product list ===
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: null as string | null,
    supplier: null as string | null,
    sortBy: 'default',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { id: userId } = useAuthStoreCookiesStorage();

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const { data: cartData, isLoading: isCartLoading } = useGetAllCarts(userId ?? '');

  const addProductToCartMutation = useAddProductToCart(userId ?? '');

  const { data: supplierData } = useGetSupplierSelections();
  const { data: categoryData } = useGetCategorySelection();

  const { data, isLoading } = useGetAllProducts({
    keyword: searchText || undefined,
    categoryName: filters.category || undefined,
    supplierName: filters.supplier || undefined,
    page: currentPage - 1,
    size: pageSize,
    sort: (() => {
      switch (filters.sortBy) {
        case 'price-asc': return 'productPrice,asc';
        case 'price-desc': return 'productPrice,desc';
        case 'name-asc': return 'productName,asc';
        case 'name-desc': return 'productName,desc';
        case 'stock-desc': return 'productQuantity,desc';
        default: return 'createAt,desc';
      }
    })(),
  });

  const products: IGetAllProductResponse[] = useMemo(() => {
    if (!data?.data?.content) return [];
    return Array.isArray(data.data.content) ? data.data.content : [];
  }, [data?.data?.content]);

  const totalProducts = data?.data?.page?.totalElements || 0;

  const suppliers = useMemo(() => {
    return ((supplierData?.data ?? []) as IGetSupplierSelectionResponse[])
      .map((supplier) => supplier.supplierName);
  }, [supplierData]);

  const categories = useMemo(() => {
    return ((categoryData?.data ?? []) as IGetCategorySelectionResponse[])
      .map((category) => category.categoryName);
  }, [categoryData]);

  // === Handlers ===
  const handleFilterChange = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ category: null, supplier: null, sortBy: 'default' });
    setSearchText('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (product: IGetAllProductResponse, quantity: number) => {
    if (!userId) {
      message.error('Please log in to add products to your cart.');
      return;
    }

    addProductToCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          toast.success(`${product.productName} added to cart.`);
          setCart(prev => {
            const existing = prev.find(item => item.productId === product.productId);
            if (existing) {
              return prev.map(item =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              return [...prev, { productId: product.productId, quantity }];
            }
          });
        },
        onError: (err) => {
          message.error(`Thêm sản phẩm thất bại: ${err.message}`);
        },
      }
    );
  };

  const renderProductList = () => {
    if (!products.length) return <Empty description={isLoading ? 'Loading...' : 'No products found'} className="my-16" />;

    if (viewMode === 'list') {
      return (
        <div className="mb-8">
          {products.map(product => (
            <ProductCard
              key={product.productId}
              product={product}
              viewMode="list"
              onViewDetail={handleViewDetail}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map(product => (
          <ProductCard
            key={product.productId}
            product={product}
            viewMode="grid"
            onViewDetail={handleViewDetail}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  };

  // === Render ===
  // Nếu có selectedProductId (từ URL) → render detail, không render list

  // Nếu không có selectedProductId → render list
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isChildRoute ? (
          <>
            <div className="mb-8 flex justify-between items-center">

              <div>
                <Title level={1} className="text-3xl font-bold text-gray-900 mb-2">Products</Title>
                <Paragraph className="text-gray-600">Browse our collection of {totalProducts} products</Paragraph>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <ShoppingCartOutlined className="text-xl" />
                <Badge
                  count={cartData?.data.items?.reduce((sum, item) => sum + item.product.productQuantity, 0) ?? 0}
                  showZero
                >
                  <span className="text-lg font-semibold">Cart</span>
                </Badge>
              </div>
            </div>

            <SearchBar value={searchText} onChange={value => { setSearchText(value); setCurrentPage(1); }} />

            <FilterBar
              suppliers={suppliers}
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {products.length} of {totalProducts} products</p>
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>


            {renderProductList()}

            {totalProducts > 0 && (
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  total={totalProducts}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                />
              </div>
            )}


          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
