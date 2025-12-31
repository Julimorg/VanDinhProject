
import { FilterButton } from "@/components/Product/FilterButton";
import { FilterSidebar } from "@/components/Product/FilterSidebar";
import { ProductCard } from "@/components/Product/ProductCard";
import { SearchBar } from "@/components/Product/SearchBar";
import { RefreshableLayout } from "@/components/RefreshableLayout";

import { useGetAllProducts } from "@/hooks/Product/useGetAllProducts";
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
import { IGetAllProductResponse } from "@/Interface/Product/IGetAllProducts";

export default function ProductScreen() {
  const { refreshApp } = useRefresh();

  const [keyword, setKeyword] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const size = 10; 

  // const params = useMemo(() => ({
  //   keyword: keyword || undefined,
  //   categoryName: selectedCategory || undefined,
  //   supplierName: selectedSupplier || undefined,
  //   page,
  //   size,
  //   sort: "createAt,desc", 
  // }), [keyword, selectedCategory, selectedSupplier, page]);

  const {
    data,
    isLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useGetAllProducts();

  
  console.log("Fetched products:", data?.data.content.length);

  // Gom tất cả sản phẩm từ các lần fetch trước (nếu bạn muốn giữ lịch sử khi thay filter)
  // Nếu không cần, chỉ dùng data hiện tại
  const [allProducts, setAllProducts] = useState<IGetAllProductResponse>([]);

  React.useEffect(() => {
    if (data?.data.content) {
      if (page === 1) {
        // Trang đầu → reset list
        setAllProducts(data.data.content);
      } else {
        // Trang tiếp → append
        setAllProducts(prev => [...prev, ...data.data.content]);
      }
    }
  }, [data, page]);

  const pagination = data?.data.page;

  const hasMore = pagination 
    ? (pagination.number + 1) < pagination.totalPages 
    : false;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleViewDetail = (productId: string) => {
    console.log("Xem chi tiết sản phẩm:", productId);
    // navigation.navigate("ProductDetail", { id: productId });
  };

  const handleRetry = () => {
    setPage(1);
    refetch();
  };

  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-3">Đang tải thêm...</Text>
      </View>
    );
  };

  // Error state
  if (fetchError && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="text-xl font-semibold text-red-600 mt-4 text-center">
          Không thể tải sản phẩm
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          className="mt-8 bg-blue-600 px-8 py-4 rounded-xl flex-row items-center"
        >
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text className="text-white font-semibold ml-2">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <RefreshableLayout onRefresh={refreshApp}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View>
          <SearchBar keyword={keyword} onChangeKeyword={setKeyword} />
          <FilterButton onPress={() => setFilterVisible(true)} />
        </View>

        <FlatList
          data={allProducts}
          keyExtractor={(item) => item.productId}
          numColumns={2}
          columnWrapperClassName="justify-between px-2"
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleViewDetail(item.productId)}
            />
          )}
          ListEmptyComponent={
            !isLoading && allProducts.length === 0 ? (
              <View className="py-20 items-center">
                <Text className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            isLoading && page === 1 ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4">Đang tải...</Text>
              </View>
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isFetching && page === 1} onRefresh={handleRefresh} />
          }
        />

        <FilterSidebar
          visible={filterVisible}
          onClose={() => {
            setFilterVisible(false);
            // Khi đóng filter → reset page để load lại từ đầu với filter mới
            setPage(1);
          }}
        />
      </SafeAreaView>
    </RefreshableLayout>
  );
}