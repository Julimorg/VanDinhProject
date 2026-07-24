import React, { useState, useCallback, useMemo, useRef } from "react";
import { FlatList, View, Text, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { FilterBar } from "../../components/Product/FilterBar";
import { ProductCard } from "../../components/Product/ProductCard";
import { ProductSkeleton } from "../../components/Product/ProductSkeleton";
import { SearchBar } from "../../components/Product/SearchBar";
import { SORT_OPTIONS } from "../../components/Product/SortDropdown";

import { useGetAllProducts } from "../../hooks/Product/useGetAllProducts";
import { useDebounce } from "../../hooks/useDebounce";
import { useRefresh } from "../../context/RefreshContextType ";
import { ActiveFilterChips } from "../../components/Product/ActiveFilterChip";
import { CategoryIconRow } from "../../components/Product/CategoryDropdown";
import { FilterSidebar } from "../../components/Product/FilterSideBar";

const PAGE_SIZE = 10;

export default function ProductScreen() {
  const { refreshApp } = useRefresh();
  const flatListRef = useRef<FlatList>(null);
  // Chặn onEndReached bắn nhiều lần trong cùng 1 lần cuộn (bug kinh điển FlatList)
  const onEndReachedCalledDuringMomentum = useRef(true);

  const [keyword, setKeyword] = useState("");
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortValue, setSortValue] = useState<string>(SORT_OPTIONS[0].value);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const debouncedKeyword = useDebounce(keyword, 500);

  const params = useMemo(() => {
    const cleanKeyword = debouncedKeyword.trim();
    return {
      keyword: cleanKeyword || undefined,
      categoryName: selectedCategory || undefined,
      supplierName: selectedSuppliers.length ? selectedSuppliers.join(",") : undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      size: PAGE_SIZE,
      sort: sortValue,
    };
  }, [debouncedKeyword, selectedCategory, selectedSuppliers, minPrice, maxPrice, sortValue]);

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
    return data.pages.flatMap((page) => page?.data?.content || []);
  }, [data]);

  const totalElements = useMemo(() => {
    const lastPage = data?.pages?.[data.pages.length - 1];
    return lastPage?.data?.page?.totalElements ?? null;
  }, [data]);

  const isSearching = keyword.trim() !== debouncedKeyword.trim();
  const isInitialLoading = isLoading || (isFetching && !isFetchingNextPage && allProducts.length === 0);

  const hasActiveFilters = !!(
    selectedCategory ||
    selectedSuppliers.length ||
    minPrice != null ||
    maxPrice != null ||
    debouncedKeyword
  );
  const hasAdvancedFilters = minPrice != null || maxPrice != null;

  const handleLoadMore = useCallback(() => {
    if (
      !onEndReachedCalledDuringMomentum.current &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetching
    ) {
      onEndReachedCalledDuringMomentum.current = true;
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetch(), refreshApp()]);
    } catch (error) {
      console.error("Lỗi refresh:", error);
    }
  }, [refetch, refreshApp]);

  const handleViewDetail = useCallback((productId: string) => {
    router.push({ pathname: "/ProductDetail", params: { productId } });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSuppliers([]);
    setMinPrice(null);
    setMaxPrice(null);
    setKeyword("");
  }, []);

  const handleRemoveSupplier = useCallback((name: string) => {
    setSelectedSuppliers((prev) => prev.filter((s) => s !== name));
  }, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 px-2">
        <ProductSkeleton count={viewMode === "grid" ? 2 : 1} />
      </View>
    );
  }, [isFetchingNextPage, viewMode]);

  const renderEmpty = useCallback(() => {
    if (isInitialLoading) return null;

    if (isSearching) {
      return (
        <View className="px-2 pt-2">
          <ProductSkeleton count={6} />
        </View>
      );
    }

    return (
      <View className="py-20 items-center px-6">
        <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Ionicons name="search" size={48} color="#9CA3AF" />
        </View>
        <Text className="text-gray-800 text-xl font-bold">Không tìm thấy sản phẩm</Text>
        <Text className="text-gray-500 text-base mt-2 text-center px-4">
          {hasActiveFilters
            ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
            : "Chưa có sản phẩm nào trong danh sách"}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={handleResetFilters}
            className="mt-6 bg-blue-600 px-8 py-3.5 rounded-full flex-row items-center shadow-sm"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text className="text-white font-semibold ml-2 text-base">Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [isInitialLoading, isSearching, hasActiveFilters, handleResetFilters]);

  const renderHeader = useCallback(() => {
    if (!isInitialLoading) return null;
    return (
      <View className="px-2 pt-2">
        <ProductSkeleton count={6} />
      </View>
    );
  }, [isInitialLoading]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ProductCard product={item} onPress={() => handleViewDetail(item.productId)} />
    ),
    [handleViewDetail]
  );

  const keyExtractor = useCallback((item: any, index: number) => `${item.productId}-${index}`, []);

  // ERROR SCREEN
  if (fetchError && !isInitialLoading && allProducts.length === 0) {
    const errorMessage = (fetchError as any)?.message || "";
    const isNetworkError = /network|internet|connection/i.test(errorMessage);

    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-red-50 w-28 h-28 rounded-full items-center justify-center mb-8">
            <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center">
              <Ionicons name={isNetworkError ? "cloud-offline" : "alert-circle"} size={48} color="#EF4444" />
            </View>
          </View>
          <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
            {isNetworkError ? "Mất kết nối" : "Không thể tải sản phẩm"}
          </Text>
          <Text className="text-gray-500 text-base text-center leading-6 mb-2">
            {isNetworkError
              ? "Vui lòng kiểm tra kết nối mạng và thử lại"
              : "Đã có lỗi xảy ra khi tải danh sách sản phẩm"}
          </Text>
          <View className="mt-10 w-full max-w-xs">
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-blue-600 px-8 py-4 rounded-xl flex-row items-center justify-center shadow-lg mb-3"
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={22} color="#FFF" />
              <Text className="text-white font-bold ml-2.5 text-base">Thử lại</Text>
            </TouchableOpacity>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={handleResetFilters}
                className="bg-gray-100 px-8 py-4 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={22} color="#6B7280" />
                <Text className="text-gray-700 font-semibold ml-2.5 text-base">Xóa bộ lọc</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center px-4 pt-2 pb-1 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1" hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-gray-900">Sản phẩm</Text>
          <Text className="text-sm text-gray-400 mt-0.5">Vật liệu xây dựng &amp; trang trí</Text>
        </View>
      </View>

      <View className="bg-white">
        <SearchBar
          keyword={keyword}
          onChangeKeyword={setKeyword}
          isSearching={isSearching || (isFetching && keyword.length > 0)}
        />

        <FilterBar
          onOpenAdvancedFilter={() => setAdvancedFilterVisible(true)}
          hasAdvancedFilters={hasAdvancedFilters}
          sortValue={sortValue}
          onChangeSort={setSortValue}
          selectedSuppliers={selectedSuppliers}
          onChangeSuppliers={setSelectedSuppliers}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode((v) => (v === "grid" ? "list" : "grid"))}
        />

        <CategoryIconRow selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </View>

      <ActiveFilterChips
        selectedCategory={selectedCategory}
        selectedSuppliers={selectedSuppliers}
        onRemoveCategory={() => setSelectedCategory(null)}
        onRemoveSupplier={handleRemoveSupplier}
        onClearAll={handleResetFilters}
      />

      {totalElements != null && (
        <View className="px-4 pb-2 bg-white">
          <Text className="text-sm text-gray-500 font-medium">{totalElements} sản phẩm</Text>
        </View>
      )}

      <FlatList
        key={viewMode}
        ref={flatListRef}
        data={allProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={viewMode === "grid" ? 2 : 1}
        columnWrapperClassName={viewMode === "grid" ? "justify-between px-2" : undefined}
        contentContainerClassName="pb-32 pt-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
        bounces
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
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
        removeClippedSubviews
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />

      <FilterSidebar
        visible={advancedFilterVisible}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangePriceRange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        onClose={() => setAdvancedFilterVisible(false)}
      />
    </SafeAreaView>
  );
}