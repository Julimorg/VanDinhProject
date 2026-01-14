import { SupplierSkeleton } from "@/components/Supplier/LoadingSkeleton";
import { SupplierCard } from "@/components/Supplier/SupplierCard";
import { SupplierSearchBar } from "@/components/Supplier/SupplierSearchBar";
import { useSuppliersInfinite } from "@/hooks/Supplier/useSuppliersInfinite";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SKELETON_COUNT = 8;

export default function SupplierScreen() {
  const flatListRef = React.useRef<FlatList>(null);
  const [searchText, setSearchText] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    refetch,
    error: fetchError,
    isRefetching,
    isRefetchError,
  } = useSuppliersInfinite({ keyword: searchText });

  const suppliers = data?.pages.flatMap((page) => page.content) ?? [];
  const isInitialLoading = isLoading && suppliers.length === 0;

  const handleRetry = useCallback(() => {
    console.log("🔄 Retry loading suppliers");
    refetch();
  }, [refetch]);

  const handleSupplierPress = useCallback((supplierId: string) => {
    console.log("Navigate to supplier detail:", supplierId);
    // TODO: navigation.navigate("SupplierDetail", { id: supplierId });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("⬇️ Loading next page...");
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScrollToTop = useCallback(() => {
    try {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
      console.log("Ref current:", flatListRef.current); // Check xem có null không
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (error) {
      console.log("Scroll to top error:", error);
    }
  }, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="text-gray-500 mt-3">Đang tải thêm...</Text>
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isInitialLoading) return null;

    return (
      <View className="py-20 items-center px-6">
        <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Ionicons name="business" size={48} color="#9CA3AF" />
        </View>
        <Text className="text-gray-800 text-xl font-bold">
          {searchText ? "Không tìm thấy nhà cung cấp" : "Chưa có nhà cung cấp"}
        </Text>
        <Text className="text-gray-500 text-base mt-2 text-center px-4">
          {searchText
            ? "Thử tìm kiếm với từ khóa khác"
            : "Danh sách nhà cung cấp đang trống"}
        </Text>
      </View>
    );
  }, [isInitialLoading, searchText]);

  const renderHeader = useCallback(() => {
    if (!isInitialLoading) return null;

    return (
      <View className="pt-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SupplierSkeleton key={`skeleton-${i}`} />
        ))}
      </View>
    );
  }, [isInitialLoading]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <SupplierCard
        item={{
          ...item,
          supplierImg:
            item.supplierImg instanceof File
              ? URL.createObjectURL(item.supplierImg)
              : item.supplierImg,
        }}
        onPress={() => handleSupplierPress(item.supplierId)}
      />
    ),
    [handleSupplierPress]
  );

  const keyExtractor = useCallback((item: any) => item.supplierId, []);

  // Enhanced Error Screen
  if (fetchError && !isLoading && suppliers.length === 0) {
    const errorMessage = (fetchError as any)?.message || "";
    const isNetworkError =
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("internet") ||
      errorMessage.toLowerCase().includes("connection");

    return (
      <SafeAreaView
        className="flex-1 bg-gradient-to-b from-gray-50 to-white"
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center px-8">
          {/* Icon với animation pulse effect */}
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
            {isNetworkError ? "Mất kết nối" : "Không thể tải nhà cung cấp"}
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-base text-center leading-6 mb-2">
            {isNetworkError
              ? "Vui lòng kiểm tra kết nối mạng và thử lại"
              : "Đã có lỗi xảy ra khi tải danh sách nhà cung cấp"}
          </Text>

          {/* Technical error details */}
          {!isNetworkError && errorMessage && (
            <View className="bg-red-50 px-4 py-3 rounded-xl mt-3 max-w-full">
              <Text
                className="text-red-600 text-xs text-center"
                numberOfLines={2}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleRetry}
            className="mt-10 bg-blue-600 px-8 py-4 rounded-xl flex-row items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={22} color="#FFF" />
            <Text className="text-white font-bold ml-2.5 text-base">
              Thử lại
            </Text>
          </TouchableOpacity>

          {/* Help text */}
          <View className="mt-8 flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#9CA3AF"
            />
            <Text className="text-gray-400 text-sm ml-1.5">
              Vẫn gặp vấn đề? Liên hệ hỗ trợ
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <Text className="text-3xl font-extrabold text-center py-6 text-black">
          Nhà Cung Cấp
        </Text>
        <SupplierSearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm nhà cung cấp..."
        />
      </View>

      {/* Suppliers List */}
      <FlatList
        ref={flatListRef}
        data={suppliers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white"
        contentContainerClassName="pb-32"
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
            refreshing={
              isFetching && !isFetchingNextPage && suppliers.length > 0
            }
            onRefresh={refetch}
            colors={["#000000"]}
            tintColor="#000000"
            title="Đang làm mới..."
            titleColor="#666666"
          />
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={6}
        windowSize={10}
        // Error boundary
        onScrollToIndexFailed={(info) => {
          console.warn("Scroll to index failed:", info);
        }}
      />

      {/* FLOATING "SCROLL TO TOP" BUTTON */}
      {/* {suppliers.length > 10 && (
        <TouchableOpacity
          className="absolute bottom-28 right-4 bg-black w-14 h-14 rounded-full items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={handleScrollToTop}
        >
          <Ionicons name="arrow-up" size={24} color="#FFF" />
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
}
