
import React from 'react';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import { SupplierCard } from './SupplierCard';

interface SupplierListProps {
  data: any[];
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  onSupplierPress: (supplierId: string) => void;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  data,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onSupplierPress,
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.supplierId}
      renderItem={({ item }) => (
        <SupplierCard item={item} onPress={() => onSupplierPress(item.supplierId)} />
      )}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <View className="py-8">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : null
      }
      ListEmptyComponent={() => (
        <View className="items-center py-20">
          <Text className="text-gray-500 text-lg">Không tìm thấy nhà cung cấp nào</Text>
        </View>
      )}
      // Optional: Add initial skeletons
      refreshing={false}
    />
  );
};