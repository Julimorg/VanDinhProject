import { FilterButton } from "@/components/Product/FilterButton";
import { FilterSidebar } from "@/components/Product/FilterSidebar";
import { ProductCard } from "@/components/Product/ProductCard";
import { SearchBar } from "@/components/Product/SearchBar";
import { ProductSkeleton } from "@/components/Product/ProductSkeleton"; 
import { useGetAllProducts } from "@/hooks/Product/useGetAllProducts";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useState, useCallback, useMemo } from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRefresh } from "@/context/RefreshContextType ";

export default function ProductScreen() {
  const { refreshApp } = useRefresh();

  const [keyword, setKeyword] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const debouncedKeyword = useDebounce(keyword, 500);

  const params = useMemo(() => {
    const cleanKeyword = debouncedKeyword.trim();
    return {
      keyword: cleanKeyword || undefined,
      categoryName: selectedCategory || undefined, // Đã đúng - truyền text
      supplierName: selectedSupplier || undefined, // Đã đúng - truyền text
      size: 5,
      sort: "createAt,desc",
    };
  }, [debouncedKeyword, selectedCategory, selectedSupplier]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: fetchError,
    refetch,
  } = useGetAllProducts(params);

  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page?.data?.content || []);
  }, [data]);

  React.useEffect(() => {
    console.log("===  PRODUCT SCREEN DEBUG ===");
    console.log("Raw keyword (typing):", keyword);
    console.log("Debounced keyword (API):", debouncedKeyword);
    console.log("Filter params:", params);
    console.log("Total products loaded:", allProducts.length);
    console.log("Total pages fetched:", data?.pages?.length || 0);
    
    if (data?.pages) {
      const lastPage = data.pages[data.pages.length - 1];
      const pagination = lastPage?.data?.page;
      
      if (pagination) {
        console.log("Pagination info:", {
          currentPage: pagination.number,
          pageSize: pagination.size,
          totalElements: pagination.totalElements,
          totalPages: pagination.totalPages,
          hasNextPage,
        });
      }
    }
    console.log("===============================\n");
  }, [data, params, allProducts.length, hasNextPage, keyword, debouncedKeyword]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("⬇️ Loading next page...");
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    console.log("🔄 Refreshing products...");
    try {
      // Refetch cả products và app data cùng lúc
      await Promise.all([
        refetch(),
        refreshApp()
      ]);
      console.log("✅ Refresh thành công!");
    } catch (error) {
      console.error("❌ Lỗi refresh:", error);
    }
  }, [refetch, refreshApp]);

  const handleViewDetail = useCallback((productId: string) => {
    console.log("👁 View product detail:", productId);
    // TODO: navigation.navigate("ProductDetail", { id: productId });
  }, []);

  const handleRetry = useCallback(() => {
    console.log("🔄 Retry loading products");
    refetch();
  }, [refetch]);

  const handleOpenFilter = useCallback(() => {
    console.log("🔽 Opening filter sidebar");
    setFilterVisible(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    console.log("Closing filter sidebar");
    setFilterVisible(false);
  }, []);

  const handleResetFilters = useCallback(() => {
    console.log("🗑 Resetting all filters");
    setSelectedCategory(null);
    setSelectedSupplier(null);
    setKeyword("");
  }, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-3">Đang tải thêm...</Text>
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    
    const hasActiveFilters = !!(keyword || selectedCategory || selectedSupplier);
    const isSearching = keyword.trim() !== debouncedKeyword.trim();
    
    if (isSearching) {
      return (
        <View className="py-20 items-center px-6">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Đang tìm kiếm...</Text>
        </View>
      );
    }
    
    return (
      <View className="py-20 items-center px-6">
        <Ionicons name="search" size={64} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-4 font-medium">
          Không tìm thấy sản phẩm
        </Text>
        {hasActiveFilters && (
          <>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Thử xóa bộ lọc hoặc tìm kiếm từ khóa khác
            </Text>
            <TouchableOpacity
              onPress={handleResetFilters}
              className="mt-6 bg-gray-100 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-semibold">Xóa tất cả bộ lọc</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }, [isLoading, keyword, debouncedKeyword, selectedCategory, selectedSupplier, handleResetFilters]);

  // Skeleton loading khi initial load
  const renderHeader = useCallback(() => {
    if (!isLoading) return null;
    
    return (
      <View className="px-2">
        <ProductSkeleton count={6} />
      </View>
    );
  }, [isLoading]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => handleViewDetail(item.productId)}
    />
  ), [handleViewDetail]);

  const keyExtractor = useCallback((item: any, index: number) => 
    `${item.productId}-${index}`, 
  []);

  if (fetchError && !isLoading && allProducts.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="text-xl font-semibold text-red-600 mt-4 text-center">
          Không thể tải sản phẩm
        </Text>
        <Text className="text-gray-500 mt-2 text-center">
          {(fetchError as any)?.message || "Vui lòng kiểm tra kết nối mạng"}
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          className="mt-8 bg-blue-600 px-8 py-4 rounded-xl flex-row items-center shadow-lg"
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text className="text-white font-semibold ml-2 text-base">
            Thử lại
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* HEADER SECTION */}
      <View className="bg-white shadow-sm">
        <SearchBar 
          keyword={keyword} 
          onChangeKeyword={setKeyword}
          isSearching={keyword.trim() !== debouncedKeyword.trim() || (isFetching && keyword.length > 0)}
        />
        <FilterButton 
          onPress={handleOpenFilter}
          hasActiveFilters={!!(selectedCategory || selectedSupplier)}
        />
      </View>

      {/* ACTIVE FILTERS INDICATOR */}
      {(selectedCategory || selectedSupplier || debouncedKeyword) && (
        <View className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="funnel" size={16} color="#3B82F6" />
              <Text className="text-blue-600 text-sm ml-2 flex-1" numberOfLines={1}>
                {debouncedKeyword && `Tìm: "${debouncedKeyword}"`}
                {debouncedKeyword && (selectedCategory || selectedSupplier) && " • "}
                {selectedCategory && `Danh mục: ${selectedCategory}`}
                {selectedCategory && selectedSupplier && " • "}
                {selectedSupplier && `NCC: ${selectedSupplier}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleResetFilters}
              className="ml-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PRODUCTS LIST - FlatList có RefreshControl built-in */}
      <FlatList
        data={allProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperClassName="justify-between px-2"
        contentContainerClassName="pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        
        // Empty & Loading states
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        
        // Infinite scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        
        // Pull to refresh - KHÔNG CẦN RefreshableLayout wrapper
        refreshControl={
          <RefreshControl 
            refreshing={isFetching && !isFetchingNextPage && allProducts.length > 0} 
            onRefresh={handleRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            title="Đang làm mới..."
            titleColor="#666666"
          />
        }
        
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        
        // Error boundary
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
        }}
      />

      {/* FILTER SIDEBAR MODAL */}
      <FilterSidebar
        visible={filterVisible}
        selectedCategory={selectedCategory}
        selectedSupplier={selectedSupplier}
        onSelectCategory={setSelectedCategory}
        onSelectSupplier={setSelectedSupplier}
        onClose={handleCloseFilter}
      />

      {/* FLOATING "SCROLL TO TOP" BUTTON */}
      {allProducts.length > 20 && (
        <TouchableOpacity
          className="absolute bottom-8 right-4 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={() => {
            console.log("Scroll to top");
          }}
        >
          <Ionicons name="arrow-up" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}