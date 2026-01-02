import { SupplierSkeleton } from '@/components/Supplier/LoadingSkeleton';
import { SupplierCard } from '@/components/Supplier/SupplierCard';
import { SupplierSearchBar } from '@/components/Supplier/SupplierSearchBar';
import { useSuppliersInfinite } from '@/hooks/Supplier/useSuppliersInfinite';
import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SKELETON_COUNT = 8; 

export default function SupplierScreen() {
  const [searchText, setSearchText] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useSuppliersInfinite({ keyword: searchText });

  const suppliers = data?.pages.flatMap((page) => page.content) ?? [];
  const isInitialLoading = isLoading && suppliers.length === 0;

  const handleSupplierPress = (supplierId: string) => {
    console.log('Navigate to supplier detail:', supplierId);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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

      <FlatList
        data={suppliers}
        keyExtractor={(item) => item.supplierId}
        renderItem={({ item }) => (
          <SupplierCard
            item={{
              ...item,
              supplierImg: item.supplierImg instanceof File 
                ? URL.createObjectURL(item.supplierImg) 
                : item.supplierImg,
            }}
            onPress={() => handleSupplierPress(item.supplierId)}
          />
        )}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        
        refreshing={isRefetching}
        onRefresh={refetch}

        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#000000" />
              <Text className="mt-4 text-gray-600">Đang tải thêm...</Text>
            </View>
          ) : null
        }

        ListEmptyComponent={
          <>
            {/* Skeleton khi loading lần đầu */}
            {isInitialLoading && (
              <View className="pt-4">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <SupplierSkeleton key={`skeleton-${i}`} />
                ))}
              </View>
            )}

            {/* Empty state khi không có data (không phải loading) */}
            {!isInitialLoading && suppliers.length === 0 && !isError && !isRefetchError && (
              <View className="flex-1 justify-center items-center py-20 px-8">
                <Text className="text-gray-500 text-lg text-center">
                  {searchText
                    ? 'Không tìm thấy nhà cung cấp nào phù hợp'
                    : 'Chưa có nhà cung cấp nào'}
                </Text>
              </View>
            )}

            {/* Error state */}
            {(isError || isRefetchError) && (
              <View className="flex-1 justify-center items-center py-20 px-8">
                <Text className="text-red-600 text-center text-lg font-medium mb-6">
                  Không thể tải dữ liệu
                </Text>
                <Text
                  className="text-blue-600 text-lg underline"
                  onPress={() => refetch()}
                >
                  Nhấn để thử lại
                </Text>
              </View>
            )}
          </>
        }

        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1, 
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}