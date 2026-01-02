
import React, { useState } from 'react';
import {
  StatusBar,
  View,
  Text,
  FlatList,
} from 'react-native';

import { SupplierSearchBar } from '@/components/Supplier/SupplierSearchBar';
import { useColorsInfinite } from '@/hooks/Color/useColorsInfinite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorCard } from '@/components/Color/ColorCard';
import { ColorSkeleton } from '@/components/Color/ColorSkeleton';
import { ColorSupplierDropdown } from '@/components/Color/ColorSupplierDropDown';

const INITIAL_SKELETON_COUNT = 6;

export default function ColorScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedSupplierName, setSelectedSupplierName] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useColorsInfinite({
    keyword: searchText || undefined,
    supplierName: selectedSupplierName || undefined,
  });

  const colors = data?.pages.flatMap((page) => page.content) ?? [];

  const hasNoFilter = !searchText && !selectedSupplierName;

  const handleColorPress = (colorId: string) => {
    console.log('Xem chi tiết màu:', colorId);
  };

  // Tạo data giả để hiển thị skeleton khi loading lần đầu
  const displayData = isLoading && colors.length === 0
    ? Array(INITIAL_SKELETON_COUNT).fill(null)
    : colors;

  const renderItem = ({ item }: { item: any }) => {
    if (item === null) {
      return <ColorSkeleton />;
    }
    return <ColorCard item={item} onPress={() => handleColorPress(item.colorId)} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header - luôn hiển thị rõ ràng */}
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

      {/* Danh sách - skeleton nằm ngay trong list */}
      <FlatList
        data={displayData}
        keyExtractor={(item, index) => item?.colorId || `skeleton-${index}`}
        renderItem={renderItem}

        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}

        refreshing={isRefetching}
        onRefresh={refetch}

        // Footer khi load more
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-6 px-4">
              <ColorSkeleton />
              <ColorSkeleton />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading && colors.length === 0 ? (
            hasNoFilter ? (
              <View className="flex-1 justify-center items-center py-20 px-10">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
                  Chào mừng quý khách!
                </Text>
                <Text className="text-lg text-gray-600 text-center leading-8">
                  Vui lòng tìm kiếm mã/tên màu hoặc chọn nhà cung cấp để xem bảng màu chi tiết
                </Text>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center py-20 px-8">
                <Text className="text-gray-500 text-lg text-center">
                  Không tìm thấy màu nào phù hợp với tiêu chí tìm kiếm
                </Text>
              </View>
            )
          ) : null
        }

        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Error overlay - vẫn giữ để xử lý lỗi mạng */}
      {isError && (
        <View className="absolute inset-0 bg-white justify-center items-center px-8">
          <Text className="text-red-600 text-center text-lg font-medium mb-6">
            Không thể tải bảng màu
          </Text>
          <Text
            className="text-blue-600 text-lg underline"
            onPress={() => refetch()}
          >
            Thử lại
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}