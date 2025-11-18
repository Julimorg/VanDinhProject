import React, { useState, useMemo, useEffect } from 'react';
import { Pagination, Badge, message, Typography, Empty, Card, Row, Col, Space, ConfigProvider, theme, Input, Button, Dropdown, Menu, Skeleton } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, FilterOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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
import { useGetAllCarts } from '../CartPage/Hook/useGetAllCarts';
import { useCartStore } from '../../Middleware/useCartStore';

const { Title, Text } = Typography;
const pageSize = 12;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const isChildRoute = location.pathname !== '/products';

  // === State ===
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: null as string | null,
    supplier: null as string | null,
    sortBy: 'default',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { id: userId } = useAuthStoreCookiesStorage();
  const { data: cartData, refetch: refetchCart } = useGetAllCarts(userId ?? '');
  const setCartCount = useCartStore(state => state.setCartCount);

  useEffect(() => {
    if (cartData?.data?.items) {
      const count = cartData.data.items.reduce((sum, item) => sum + item.product.productQuantity, 0);
      setCartCount(count);
    }
  }, [cartData]);

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
    return ((supplierData?.data ?? []) as IGetSupplierSelectionResponse[]).map(s => s.supplierName);
  }, [supplierData]);

  const categories = useMemo(() => {
    return ((categoryData?.data ?? []) as IGetCategorySelectionResponse[]).map(c => c.categoryName);
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
          refetchCart();
        },
        onError: (err: any) => {
          message.error(`Thêm sản phẩm thất bại: ${err.message}`);
        },
      }
    );
  };

  const cartItemCount = cartData?.data.items?.reduce((sum, item) => sum + item.product.productQuantity, 0) ?? 0;

  // === Filter Menu ===
  const filterMenu = (
    <Menu
      style={{ minWidth: 220, borderRadius: 12, padding: 8 }}
      onClick={(e) => {
        const key = e.key; // string
        if (key === 'reset') {
          handleResetFilters();
        } else {
          const [type, value] = key.split(/-(.+)/);
          handleFilterChange(type, value === 'all' ? null : value);
        }
      }}
    >
      {/* Category SubMenu */}
      <Menu.SubMenu key="category" title="Category">
        <Menu.Item key="category-all">All Categories</Menu.Item>
        {categories.map((cat) => (
          <Menu.Item key={`category-${cat}`}>{cat}</Menu.Item>
        ))}
      </Menu.SubMenu>

      {/* Supplier SubMenu */}
      <Menu.SubMenu key="supplier" title="Supplier">
        <Menu.Item key="supplier-all">All Suppliers</Menu.Item>
        {suppliers.map((sup) => (
          <Menu.Item key={`supplier-${sup}`}>{sup}</Menu.Item>
        ))}
      </Menu.SubMenu>

      {/* Sort SubMenu */}
      <Menu.SubMenu
        key="sortBy"
        title={
          <>
            <SortAscendingOutlined style={{ marginRight: 4 }} />
            Sort By
          </>
        }
      >
        <Menu.Item key="sortBy-default">Default (Newest)</Menu.Item>
        <Menu.Item key="sortBy-price-asc">Price: Low → High</Menu.Item>
        <Menu.Item key="sortBy-price-desc">Price: High → Low</Menu.Item>
        <Menu.Item key="sortBy-name-asc">Name: A → Z</Menu.Item>
        <Menu.Item key="sortBy-name-desc">Name: Z → A</Menu.Item>
        <Menu.Item key="sortBy-stock-desc">Most in Stock</Menu.Item>
      </Menu.SubMenu>

      <Menu.Divider />
      <Menu.Item key="reset" danger>
        Reset All Filters
      </Menu.Item>
    </Menu>
  );

  if (isChildRoute) return <Outlet />;

  // Skeleton cho Product Card (Grid)
  const ProductSkeletonGrid = () => (
    <Card style={{ borderRadius: 16, overflow: 'hidden', padding: 0 }}>
      <div
        style={{
          width: '100%',
          paddingTop: '56.25%', // tỷ lệ 16:9
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%)',
          backgroundSize: '400% 100%',
          animation: 'shimmer 1.4s ease infinite',
        }}
      />
      <div style={{ paddingTop: 12 }}>
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
      </div>
    </Card>
  );


  const ProductSkeletonList = () => (
    <Card style={{ borderRadius: 16, padding: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            flex: '0 0 120px',
            height: 120,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%)',
            backgroundSize: '400% 100%',
            animation: 'shimmer 1.4s ease infinite',
          }}
        />
        <div style={{ flex: 1 }}>
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
      </div>
    </Card>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '16px' }}>
          {/* Hero Header */}
          <div style={{ marginBottom: 32 }}>
            <Row gutter={[16, 24]} align="middle" justify="space-between">
              <Col xs={24} md={16}>
                <Space direction="vertical" size={4}>
                  {isLoading ? (
                    <>
                      <Skeleton.Input style={{ width: 300, height: 48 }} active />
                      <Skeleton.Input style={{ width: 400, height: 24 }} active />
                    </>
                  ) : (
                    <>
                      <Title level={1} style={{ margin: 0, fontSize: 36, fontWeight: 700 }}>
                        <AppstoreOutlined style={{ marginRight: 12, color: token.colorPrimary }} />
                        All Products
                      </Title>
                      <Text type="secondary" style={{ fontSize: 16 }}>
                        Explore <strong>{totalProducts.toLocaleString()}</strong> amazing products from top suppliers
                      </Text>
                    </>
                  )}
                </Space>
              </Col>

              <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                <Card
                  hoverable
                  onClick={() => navigate('/cart')}
                  style={{
                    maxWidth: 180,
                    marginLeft: 'auto',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                  bodyStyle={{ padding: '16px 20px' }}
                >
                  <Space align="center">
                    <Badge count={cartItemCount} overflowCount={99} size="small">
                      <div style={{
                        background: token.colorPrimary,
                        color: 'white',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ShoppingCartOutlined style={{ fontSize: 24 }} />
                      </div>
                    </Badge>
                    <div>
                      <Text strong style={{ fontSize: 16, display: 'block' }}>Cart</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{cartItemCount} items</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Search + Filter Bar */}
          <Card bodyStyle={{ padding: '12px 16px' }} style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Row gutter={[12, 12]} align="middle">
              <Col flex="auto">
                {isLoading ? (
                  <Skeleton.Input style={{ width: '100%', height: 48 }} active />
                ) : (
                  <Input
                    size="large"
                    placeholder="Search products by name, brand, or description..."
                    prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                    allowClear
                    style={{ borderRadius: 12 }}
                  />
                )}
              </Col>

              <Col>
                <Space>
                  <Dropdown overlay={filterMenu} trigger={['click']} placement="bottomRight" disabled={isLoading}>
                    <Button size="large" icon={<FilterOutlined />} style={{ borderRadius: 12 }}>
                      Filters
                      {(filters.category || filters.supplier || filters.sortBy !== 'default') && (
                        <Badge dot style={{ marginLeft: 8 }} />
                      )}
                    </Button>
                  </Dropdown>

                  <ViewToggle viewMode={viewMode} onChange={setViewMode} disabled={isLoading} />
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Results Info */}
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {isLoading ? (
              <Skeleton.Input style={{ width: 300, height: 24 }} active />
            ) : (
              <Text style={{ fontSize: 15, color: token.colorTextSecondary }}>
                Showing <strong>{((currentPage - 1) * pageSize + 1)}–{Math.min(currentPage * pageSize, totalProducts)}</strong> of{' '}
                <strong>{totalProducts}</strong> products
              </Text>
            )}
          </div>

          {/* Loading State - Skeleton Products */}
          {isLoading ? (
            viewMode === 'grid' ? (
              <Row gutter={[20, 24]}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Col key={i} xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
                    <ProductSkeletonGrid />
                  </Col>
                ))}
              </Row>
            ) : (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeletonList key={i} />
                ))}
              </Space>
            )
          ) : products.length === 0 ? (
            <Card style={{ borderRadius: 16, textAlign: 'center', padding: '48px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical">
                    <Text strong style={{ fontSize: 18 }}>No products found</Text>
                    {Object.values(filters).some(v => v) || searchText ? (
                      <Text type="secondary">Try adjusting your filters or search term</Text>
                    ) : null}
                  </Space>
                }
              />
            </Card>
          ) : viewMode === 'grid' ? (
            <Row gutter={[20, 24]}>
              {products.map((product) => (
                <Col key={product.productId} xs={12} sm={12} md={8} lg={6} xl={6} xxl={4}>
                  <ProductCard
                    product={product}
                    viewMode="grid"
                    onViewDetail={handleViewDetail}
                    onAddToCart={handleAddToCart}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  viewMode="list"
                  onViewDetail={handleViewDetail}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </Space>
          )}

          {/* Pagination - ẩn khi loading */}
          {!isLoading && totalProducts > 0 && (
            <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                responsive
                showTotal={(total, range) => (
                  <span style={{ color: token.colorTextSecondary }}>
                    {range[0]}-{range[1]} of {total} items
                  </span>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ProductsPage;