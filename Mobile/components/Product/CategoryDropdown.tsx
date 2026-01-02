import React, { useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetCategorySelection } from "@/hooks/Product/useGetCategorySelection";

interface CategoryDropdownProps {
  selectedCategory?: string;
  onSelectCategory: (categoryName: string | null) => void;
}

// Loading Skeleton
const SkeletonItem = () => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={{ opacity }}
      className="py-3 flex-row items-center"
    >
      <View className="w-5 h-5 rounded-full bg-gray-300 mr-3" />
      <View className="flex-1">
        <View className="h-4 bg-gray-300 rounded-md w-3/4" />
      </View>
    </Animated.View>
  );
};

// Category Item với memo
const CategoryItem = memo<{
  item: any;
  isSelected: boolean;
  onSelect: () => void;
}>(({ 
  item, 
  isSelected, 
  onSelect 
}) => (
  <TouchableOpacity
    onPress={onSelect}
    className={`
      py-3.5 px-4 flex-row items-center rounded-xl mb-2
      ${isSelected ? 'bg-blue-50' : 'bg-white'}
    `}
    activeOpacity={0.7}
  >
    <View className="mr-3">
      {isSelected ? (
        <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
          <Ionicons name="checkmark" size={16} color="#FFF" />
        </View>
      ) : (
        <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
      )}
    </View>
    <Text
      className={`text-base flex-1 ${
        isSelected ? "font-semibold text-blue-600" : "text-gray-700"
      }`}
    >
      {item.categoryName}
    </Text>
    {isSelected && (
      <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
    )}
  </TouchableOpacity>
));

CategoryItem.displayName = 'CategoryItem';

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetCategorySelection({
    enabled: isOpen,
    retry: 1,
  });

  const categories = data?.data ?? [];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (categoryName: string) => {
    try {
      onSelectCategory(categoryName === selectedCategory ? null : categoryName);
      console.log("✅ Đã chọn category:", categoryName);
    } catch (selectError) {
      console.error("Lỗi khi chọn danh mục:", selectError);
    }
  };

  const handleRetry = () => {
    console.log("🔄 Người dùng bấm Thử lại danh mục");
    refetch();
  };

  return (
    <View>
      {/* Header */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className={`
          flex-row items-center justify-between py-4 px-4 rounded-xl
          ${isOpen ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-200'}
        `}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View className={`
            w-10 h-10 rounded-full items-center justify-center mr-3
            ${isOpen ? 'bg-blue-600' : 'bg-gray-300'}
          `}>
            <Ionicons 
              name="grid" 
              size={20} 
              color={isOpen ? "#FFF" : "#6B7280"} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Danh mục</Text>
            <Text className="text-base font-semibold text-gray-800">
              {selectedCategory || "Chọn danh mục"}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color={isOpen ? "#3B82F6" : "#9CA3AF"}
        />
      </TouchableOpacity>

      {/* Dropdown content */}
      {isOpen && (
        <View className="mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Loading Skeleton */}
          {isLoading === true && (
            <View className="p-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonItem key={i} />
              ))}
            </View>
          )}

          {/* Error State */}
          {isLoading === false && fetchError != null && (
            <View className="py-16 px-6 items-center">
              <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
                <Ionicons name="cloud-offline" size={40} color="#EF4444" />
              </View>
              <Text className="text-center text-gray-800 font-semibold text-lg mb-2">
                Không thể tải danh mục
              </Text>
              <Text className="text-center text-gray-500 text-sm mb-6">
                Vui lòng kiểm tra kết nối mạng và thử lại
              </Text>

              <TouchableOpacity
                onPress={handleRetry}
                className="bg-blue-600 px-8 py-3.5 rounded-xl flex-row items-center shadow-sm"
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#FFF" />
                <Text className="text-white font-semibold ml-2">Thử lại</Text>
              </TouchableOpacity>

              {__DEV__ && (
                <View className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">
                  <Text className="text-xs text-gray-600 text-center">
                    {(fetchError as any)?.message || "Unknown error"}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State */}
          {isLoading === false && fetchError == null && categories.length === 0 && (
            <View className="py-16 px-6 items-center">
              <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Ionicons name="folder-open-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-center text-gray-600 font-medium text-base">
                Chưa có danh mục nào
              </Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Danh mục sẽ hiển thị ở đây
              </Text>
            </View>
          )}

          {/* List */}
          {isLoading === false && fetchError == null && categories.length > 0 && (
            <ScrollView
              style={{ maxHeight: 320 }}
              contentContainerStyle={{ padding: 12 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {categories.map((item) => (
                <CategoryItem
                  key={item.categoryId}
                  item={item}
                  isSelected={selectedCategory === item.categoryName}
                  onSelect={() => handleSelect(item.categoryName)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};