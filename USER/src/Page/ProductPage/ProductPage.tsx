
import React, { useState, useMemo, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Popover,
  Pagination as MuiPagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import { useGetAllCarts } from '../CartPage/Hook/useGetAllCarts';
import { useCartStore } from '../../Middleware/useCartStore';
import { useAddProductToCart } from './Hook/useAddProductToCart';
import { useGetSupplierSelections } from './Hook/useGetSupplierSelection';
import { useGetCategorySelection } from './Hook/useGetCategorySelection';
import { useGetAllProducts } from './Hook/useGetAllProducts';
import type { IGetAllProductResponse } from '../../Interface/Product/IGetAllProducts';

import ProductGridCard from './Components/ProductGridCard';
import ProductListCard from './Components/ProductListCard';
import ViewToggle from './Components/ViewToggle';
import { ProductSkeletonGrid } from './Components/ProductSkeletonGrid';
import { ProductSkeletonList } from './Components/ProductSkeletonList';
import type { IGetSupplierSelectionResponse } from '../../Interface/Supplier/IGetSupplierSelection';
import type { IGetCategorySelectionResponse } from '../../Interface/Category/IGetCategorySelection';
import AddToCartModal from './Components/AddToCartModel';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';

const pageSize = 12;

interface FilterOptionRowProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterOptionRow: React.FC<FilterOptionRowProps> = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      px: 1,
      py: 0.75,
      borderRadius: 1,
      fontSize: '0.85rem',
      fontWeight: active ? 700 : 500,
      color: active ? 'primary.dark' : 'stone.700',
      bgcolor: active ? 'amber.50' : 'transparent',
      cursor: 'pointer',
      '&:hover': { bgcolor: active ? 'amber.50' : 'stone.100' },
    }}
  >
    {label}
  </Box>
);

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname !== '/products';

  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: null as string | null,
    supplier: null as string | null,
    sortBy: 'default' as string,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);

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

  const { data: supplierData, refetch: refetchSupplier, isLoading: loadingSupplier } = useGetSupplierSelections();
  const { data: categoryData, refetch: refetchCategory, isLoading: loadingCategory } = useGetCategorySelection();

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

  const totalProducts = data?.data?.page?.totalElements || 0;

  const products = useMemo(() => {
    return Array.isArray(data?.data?.content) ? data.data.content : [];
  }, [data?.data?.content]);


  const suppliers = useMemo(() => {
    return Array.isArray(supplierData?.data)
      ? supplierData.data.map((s: IGetSupplierSelectionResponse) => s.supplierName)
      : [];
  }, [supplierData?.data]);

  const categories = useMemo(() => {
    return Array.isArray(categoryData?.data)
      ? categoryData.data.map((c: IGetCategorySelectionResponse) => c.categoryName)
      : [];
  }, [categoryData?.data]);

  const cartItemCount = cartData?.data?.items?.reduce((sum, item) => sum + item.product.productQuantity, 0) ?? 0;

  // === Handlers ===
  const handleSearch = () => {
    const trimmed = searchInput.trim();
    setSearchText(trimmed);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ category: null, supplier: null, sortBy: 'default' });
    setSearchText('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetail = (productId: string) => navigate(`/products/${productId}`);

  const [addingProduct, setAddingProduct] = useState<{
    visible: boolean;
    productName?: string;
    status: 'loading' | 'success';
  }>({
    visible: false,
    status: 'loading',
  });

  const handleAddToCart = (product: IGetAllProductResponse, quantity: number) => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
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
          //toast.success(`${product.productName} đã được thêm vào giỏ!`);
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
          })
          toast.error(`Thêm thất bại: ${err.message || 'Lỗi không xác định'}`);
        }
      }
    );
  };

  // Active filters display
  const getActiveFilterNames = () => {
    const names = [];
    if (filters.category) names.push(filters.category);
    if (filters.supplier) names.push(filters.supplier);
    if (filters.sortBy !== 'default') {
      const labels: Record<string, string> = {
        'price-asc': 'Giá tăng dần',
        'price-desc': 'Giá giảm dần',
        'name-asc': 'Tên A-Z',
        'name-desc': 'Tên Z-A',
        'stock-desc': 'Tồn kho cao',
      };
      names.push(labels[filters.sortBy]);
    }
    return names;
  };

  const activeFilters = getActiveFilterNames();

  const sortOptions: Array<{ key: string; label: string }> = [
    { key: 'default', label: 'Mới nhất' },
    { key: 'price-asc', label: 'Giá: Thấp → Cao' },
    { key: 'price-desc', label: 'Giá: Cao → Thấp' },
    { key: 'name-asc', label: 'Tên: A → Z' },
    { key: 'name-desc', label: 'Tên: Z → A' },
    { key: 'stock-desc', label: 'Tồn kho nhiều nhất' },
  ];

  const filterPopover = (
    <Box sx={{ width: 280, py: 1 }}>
      <Accordion
        disableGutters
        elevation={0}
        defaultExpanded
        onChange={(_, expanded) => expanded && !categoryData && refetchCategory()}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>Danh mục</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 220, overflowY: 'auto', pt: 0 }}>
          {loadingCategory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={18} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FilterOptionRow label="Tất cả danh mục" active={!filters.category} onClick={() => handleFilterChange('category', null)} />
              {categories.map((cat: string) => (
                <FilterOptionRow key={cat} label={cat} active={filters.category === cat} onClick={() => handleFilterChange('category', cat)} />
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        elevation={0}
        onChange={(_, expanded) => expanded && !supplierData && refetchSupplier()}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>Nhà cung cấp</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 220, overflowY: 'auto', pt: 0 }}>
          {loadingSupplier ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={18} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FilterOptionRow label="Tất cả nhà cung cấp" active={!filters.supplier} onClick={() => handleFilterChange('supplier', null)} />
              {suppliers.map((sup: string) => (
                <FilterOptionRow key={sup} label={sup} active={filters.supplier === sup} onClick={() => handleFilterChange('supplier', sup)} />
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>Sắp xếp</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {sortOptions.map((opt) => (
              <FilterOptionRow key={opt.key} label={opt.label} active={filters.sortBy === opt.key} onClick={() => handleFilterChange('sortBy', opt.key)} />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ px: 2, pt: 1.5 }}>
        <Typography
          onClick={handleResetFilters}
          sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Xóa tất cả bộ lọc
        </Typography>
      </Box>
    </Box>
  );

  if (isChildRoute) return <Outlet />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
              <p className="text-gray-600 mt-1">
                Khám phá <strong className="text-gray-900">{totalProducts.toLocaleString('vi-VN')}</strong> sản phẩm chất lượng
              </p>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              <div className="relative">
                <ShoppingCartOutlinedIcon className="text-2xl" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className="font-semibold">Giỏ hàng</span>
            </button>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar - Chỉ search khi Enter hoặc bấm icon */}
            <div className="flex-1 relative">
              <SearchOutlinedIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10 cursor-pointer hover:text-black transition"
                onClick={handleSearch}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tên sản phẩm, mã, nhà cung cấp..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchText('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <CloseOutlinedIcon />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-800 transition"
              >
                <SearchOutlinedIcon />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                disabled={isLoading}
                className="h-12 px-5 border border-gray-300 rounded-xl hover:border-black flex items-center gap-2 bg-white transition disabled:opacity-50"
              >
                <FilterListRoundedIcon sx={{ fontSize: 20 }} />
                <span className="font-medium">Bộ lọc</span>
                {activeFilters.length > 0 && (
                  <span className="ml-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
              <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={() => setFilterAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}
              >
                {filterPopover}
              </Popover>

              <ViewToggle viewMode={viewMode} onChange={setViewMode} disabled={isLoading} />
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <span className="text-sm text-gray-600">Đang lọc theo:</span>
              {activeFilters.map((filter, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 text-sm rounded-xl"
                >
                  {filter}
                  <button
                    onClick={() => {
                      if (filter === filters.category) handleFilterChange('category', null);
                      if (filter === filters.supplier) handleFilterChange('supplier', null);
                      if (filter.includes('Giá') || filter.includes('Tên') || filter.includes('Tồn kho'))
                        handleFilterChange('sortBy', 'default');
                    }}
                    className="hover:bg-gray-300 rounded-full p-1 transition"
                  >
                    <CloseOutlinedIcon className="text-xs" />
                  </button>
                </span>
              ))}
              <button onClick={handleResetFilters} className="text-sm text-gray-600 hover:text-black underline">
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-sm text-gray-600">
          Hiển thị {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalProducts)} trong{' '}
          <strong>{totalProducts.toLocaleString('vi-VN')}</strong> sản phẩm
        </div>

        {/* Products */}
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-7">
              {Array.from({ length: 15 }).map((_, i) => (
                <ProductSkeletonGrid key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeletonList key={i} />
              ))}
            </div>
          )
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <SearchOutlinedIcon sx={{ fontSize: 56, color: 'stone.300', mb: 2 }} />
            <p className="text-xl font-semibold text-gray-800">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-600 mt-2">Hãy thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-7">
            {products.map((product) => (
              <ProductGridCard
                key={product.productId}
                product={product}
                onViewDetail={handleViewDetail}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <ProductListCard
                key={product.productId}
                product={product}
                onViewDetail={handleViewDetail}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalProducts > pageSize && (
          <div className="mt-16 flex justify-center">
            <MuiPagination
              page={currentPage}
              count={Math.ceil(totalProducts / pageSize)}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
              shape="rounded"
            />
          </div>
        )}

        <AddToCartModal
          visible={addingProduct.visible}
          productName={addingProduct.productName}
          status={addingProduct.status}
        />
      </div>
    </div>
  );
};

export default ProductsPage;