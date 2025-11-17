// import React, { useState, useMemo } from 'react';
// import { Pagination, Badge, message, Typography, Empty, Card } from 'antd';
// import { ShoppingCartOutlined } from '@ant-design/icons';
// import SearchBar from './Components/SearchBar';
// import FilterBar from './Components/FilterButton';
// import ViewToggle from './Components/ViewToggle';
// import ProductCard from './Components/ProductCard'; // Giả sử path đúng, điều chỉnh nếu cần
// import { mockProducts } from './mockProduct';

// const { Title, Paragraph } = Typography;

// interface Product {
//   productId: string;
//   productName: string;
//   productImage: string[];
//   productVolume: string;
//   productUnit: string;
//   ProductCode: string;
//   productQuantity: number;
//   productPrice: number;
//   supplierName: string;
//   colorName: string;
//   categoryName: string;
//   createAt: string;
//   updateAt: string;
// }

// const ProductsPage: React.FC = () => {
//   const [searchText, setSearchText] = useState('');
//   const [filters, setFilters] = useState({
//     category: null,
//     supplier: null,
//     sortBy: 'default'
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [cart, setCart] = useState([]);
//   const pageSize = 8;

//   // Extract unique suppliers and categories
//   const suppliers = useMemo(() => 
//     [...new Set(mockProducts.map(p => p.supplierName))].sort(),
//     []
//   );
  
//   const categories = useMemo(() => 
//     [...new Set(mockProducts.map(p => p.categoryName))].sort(),
//     []
//   );

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     let result = mockProducts.filter(product => {
//       const matchSearch = product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
//                          product.ProductCode.toLowerCase().includes(searchText.toLowerCase());
//       const matchCategory = !filters.category || product.categoryName === filters.category;
//       const matchSupplier = !filters.supplier || product.supplierName === filters.supplier;
//       return matchSearch && matchCategory && matchSupplier;
//     });

//     // Sort
//     switch (filters.sortBy) {
//       case 'price-asc':
//         result.sort((a, b) => a.productPrice - b.productPrice);
//         break;
//       case 'price-desc':
//         result.sort((a, b) => b.productPrice - a.productPrice);
//         break;
//       case 'name-asc':
//         result.sort((a, b) => a.productName.localeCompare(b.productName));
//         break;
//       case 'name-desc':
//         result.sort((a, b) => b.productName.localeCompare(a.productName));
//         break;
//       case 'stock-desc':
//         result.sort((a, b) => b.productQuantity - a.productQuantity);
//         break;
//       default:
//         break;
//     }

//     return result;
//   }, [searchText, filters]);

//   // Paginate products
//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     return filteredProducts.slice(startIndex, startIndex + pageSize);
//   }, [filteredProducts, currentPage]);

//   const handleFilterChange = (key: string, value: string | null) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       category: null,
//       supplier: null,
//       sortBy: 'default'
//     });
//     setSearchText('');
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleViewDetail = (productId: string) => {
//     // Navigate to product detail page
//     message.info(`Navigating to product detail: ${productId}`);
//     // In real app: navigate(`/product-detail/${productId}`);
//   };

//   const handleAddToCart = (product: Product) => {
//     const existingItem = cart.find((item: any) => item.productId === product.productId);
    
//     if (existingItem) {
//       setCart(cart.map((item: any) => 
//         item.productId === product.productId 
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ));
//       message.success(`Increased ${product.productName} quantity in cart`);
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//       message.success(`${product.productName} added to cart`);
//     }
//   };

//   // Inline ProductList logic (gộp từ component cũ)
//   const renderProductList = () => {
//     if (paginatedProducts.length === 0) {
//       return (
//         <Empty
//           description="No products found"
//           className="my-16"
//         />
//       );
//     }

//     if (viewMode === 'list') {
//       return (
//         <div className="mb-8">
//           {paginatedProducts.map(product => (
//             <ProductCard 
//               key={product.productId} 
//               product={product} 
//               viewMode="list"
//               onViewDetail={handleViewDetail}
//               onAddToCart={handleAddToCart}
//             />
//           ))}
//         </div>
//       );
//     }

//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//         {paginatedProducts.map(product => (
//           <ProductCard 
//             key={product.productId} 
//             product={product} 
//             viewMode="grid"
//             onViewDetail={handleViewDetail}
//             onAddToCart={handleAddToCart}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <Title level={1} className="text-3xl font-bold text-gray-900 mb-2">Products</Title>
//               <Paragraph className="text-gray-600">Browse our collection of {mockProducts.length} products</Paragraph>
//             </div>
//             <div className="hidden sm:flex items-center gap-2">
//               <ShoppingCartOutlined className="text-xl" />
//               <Badge count={cart.reduce((sum: number, item: any) => sum + item.quantity, 0)} showZero>
//                 <span className="text-lg font-semibold">Cart</span>
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <SearchBar 
//           value={searchText}
//           onChange={(value) => {
//             setSearchText(value);
//             setCurrentPage(1);
//           }}
//         />

//         {/* Filter Bar */}
//         <FilterBar
//           suppliers={suppliers}
//           categories={categories}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onReset={handleResetFilters}
//         />

//         {/* Results Header */}
//         <div className="flex justify-between items-center mb-6">
//           <p className="text-gray-600">
//             Showing {paginatedProducts.length} of {filteredProducts.length} products
//           </p>
//           <ViewToggle viewMode={viewMode} onChange={setViewMode} />
//         </div>

//         {/* Product List (gộp inline) */}
//         {renderProductList()}

//         {/* Pagination */}
//         {filteredProducts.length > 0 && (
//           <div className="flex justify-center">
//             <Pagination
//               current={currentPage}
//               total={filteredProducts.length}
//               pageSize={pageSize}
//               onChange={handlePageChange}
//               showSizeChanger={false}
//               showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;