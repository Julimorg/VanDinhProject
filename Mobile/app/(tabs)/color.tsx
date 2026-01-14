import React, { useState, useCallback, useMemo } from 'react';
import {
  StatusBar,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SupplierSearchBar } from '@/components/Supplier/SupplierSearchBar';
import { useColorsInfinite } from '@/hooks/Color/useColorsInfinite';
import { ColorCard } from '@/components/Color/ColorCard';
import { ColorSkeleton } from '@/components/Color/ColorSkeleton';
import { ColorSupplierDropdown } from '@/components/Color/ColorSupplierDropDown';

const INITIAL_SKELETON_COUNT = 6;

export default function ColorScreen() {
  const flatListRef = React.useRef<FlatList>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSupplierName, setSelectedSupplierName] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useColorsInfinite({
    keyword: searchText || undefined,
    supplierName: selectedSupplierName || undefined,
  });

  const colors = useMemo(() => 
    data?.pages.flatMap((page) => page.content) ?? [],
    [data]
  );

  const hasNoFilter = !searchText && !selectedSupplierName;
  const isInitialLoading = isLoading && colors.length === 0;

  const handleColorPress = useCallback((colorId: string) => {
    console.log('Xem chi tiết màu:', colorId);
    // TODO: navigation.navigate("ColorDetail", { id: colorId });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log('⬇️ Loading next page...');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retry loading colors');
    refetch();
  }, [refetch]);

  const handleResetFilters = useCallback(() => {
    console.log('🗑 Resetting all filters');
    setSelectedSupplierName(null);
    setSearchText('');
  }, []);

  const handleScrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);


  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-3">Đang tải thêm màu...</Text>
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isInitialLoading) return null;

    if (hasNoFilter) {
      return (
        <View className="py-20 items-center px-6">
          <View className="bg-blue-50 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="color-palette" size={48} color="#3B82F6" />
          </View>
          <Text className="text-gray-800 text-2xl font-bold text-center mb-3">
            Chào mừng quý khách!
          </Text>
          <Text className="text-gray-500 text-base text-center leading-6 px-4">
            Vui lòng tìm kiếm mã/tên màu hoặc chọn nhà cung cấp để xem bảng màu chi tiết
          </Text>
        </View>
      );
    }

    return (
      <View className="py-20 items-center px-6">
        <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Ionicons name="search" size={48} color="#9CA3AF" />
        </View>
        <Text className="text-gray-800 text-xl font-bold">
          Không tìm thấy màu sơn
        </Text>
        <Text className="text-gray-500 text-base mt-2 text-center px-4">
          Thử tìm kiếm với từ khóa khác hoặc chọn nhà cung cấp khác
        </Text>
        <TouchableOpacity
          onPress={handleResetFilters}
          className="mt-6 bg-blue-600 px-8 py-3.5 rounded-full flex-row items-center shadow-sm"
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color="#FFF" />
          <Text className="text-white font-semibold ml-2 text-base">
            Xóa bộ lọc
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [isInitialLoading, hasNoFilter, handleResetFilters]);

  const renderHeader = useCallback(() => {
    if (!isInitialLoading) return null;

    return (
      <View className="pt-5 px-4">
        {Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, i) => (
          <ColorSkeleton key={`skeleton-${i}`} />
        ))}
      </View>
    );
  }, [isInitialLoading]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ColorCard 
        item={item} 
        onPress={() => handleColorPress(item.colorId)} 
      />
    ),
    [handleColorPress]
  );

  const keyExtractor = useCallback(
    (item: any) => item.colorId,
    []
  );

  // Enhanced Error Screen
  if (fetchError && !isLoading && colors.length === 0) {
    const errorMessage = (fetchError as any)?.message || "";
    const isNetworkError = errorMessage.toLowerCase().includes("network") || 
                          errorMessage.toLowerCase().includes("internet") ||
                          errorMessage.toLowerCase().includes("connection");
    
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-50 to-white" edges={['top']}>
        <View className="flex-1 items-center justify-center px-8">
          {/* Icon with nested circles */}
          <View className="bg-red-50 w-28 h-28 rounded-full items-center justify-center mb-8 shadow-sm">
            <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center">
              <Ionicons 
                name={isNetworkError ? "cloud-offline" : "alert-circle"} 
                size={48} 
                color="#EF4444" 
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
            {isNetworkError ? "Mất kết nối" : "Không thể tải bảng màu"}
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-base text-center leading-6 mb-2">
            {isNetworkError 
              ? "Vui lòng kiểm tra kết nối mạng và thử lại"
              : "Đã có lỗi xảy ra khi tải bảng màu sơn"}
          </Text>

          {/* Technical error details */}
          {!isNetworkError && errorMessage && (
            <View className="bg-red-50 px-4 py-3 rounded-xl mt-3 max-w-full">
              <Text className="text-red-600 text-xs text-center" numberOfLines={2}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-10 w-full max-w-xs">
            {/* Primary Action - Retry */}
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-blue-600 px-8 py-4 rounded-xl flex-row items-center justify-center shadow-lg mb-3"
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={22} color="#FFF" />
              <Text className="text-white font-bold ml-2.5 text-base">
                Thử lại
              </Text>
            </TouchableOpacity>

            {/* Secondary Action - Reset filters */}
            {(selectedSupplierName || searchText) && (
              <TouchableOpacity
                onPress={handleResetFilters}
                className="bg-gray-100 px-8 py-4 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={22} color="#6B7280" />
                <Text className="text-gray-700 font-semibold ml-2.5 text-base">
                  Xóa bộ lọc
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Help text */}
          <View className="mt-8 flex-row items-center">
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1.5">
              Vẫn gặp vấn đề? Liên hệ hỗ trợ
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header - Always visible */}
      <View className="bg-white shadow-sm pb-6">
        <Text className="text-3xl font-extrabold text-center pt-6 text-gray-900 mb-4">
          Bảng Màu Sơn
        </Text>

        <View className="px-4 mb-4">
          <SupplierSearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm mã màu, tên màu..."
          />
        </View>

        <View className="px-4">
          <ColorSupplierDropdown
            selectedSupplierName={selectedSupplierName}
            onSelectSupplier={setSelectedSupplierName}
          />
        </View>
      </View>

      {/* Active Filters Indicator */}
      {(selectedSupplierName || searchText) && (
        <View className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="funnel" size={16} color="#3B82F6" />
              <Text className="text-blue-600 text-sm ml-2 flex-1" numberOfLines={1}>
                {searchText && `Tìm: "${searchText}"`}
                {searchText && selectedSupplierName && " • "}
                {selectedSupplierName && `NCC: ${selectedSupplierName}`}
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

      {/* Colors List */}
      <FlatList
        data={colors}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
        contentContainerClassName="pt-5 pb-32"

        // Empty & Loading states
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}

        // Infinite scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}

        // Pull to refresh
        refreshControl={
          <RefreshControl 
            refreshing={isFetching && !isFetchingNextPage && colors.length > 0} 
            onRefresh={refetch}
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
        initialNumToRender={8}
        windowSize={10}

        // Error boundary
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
        }}
      />

      {/* Floating "Scroll to Top" Button */}
      {/* {colors.length > 15 && (
        <TouchableOpacity
          className="absolute bottom-28 right-4 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={handleScrollToTop}
        >
          <Ionicons name="arrow-up" size={24} color="#FFF" />
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
}