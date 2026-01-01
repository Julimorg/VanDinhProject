import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetCategorySelection } from "@/hooks/Product/useGetCategorySelection";

interface CategoryDropdownProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch, // thêm refetch để retry khi lỗi
  } = useGetCategorySelection({
    enabled: isOpen,
    retry: 1, // retry 1 lần tự động khi lỗi mạng
    
  });

  const categories = data?.data ?? [];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (categoryId: string) => {
    try {
      onSelectCategory(categoryId === selectedCategory ? null : categoryId);
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
        className="flex-row items-center justify-between py-4 border-b border-gray-100"
        activeOpacity={0.7}
      >
        <Text className="text-base font-medium text-gray-800">
          Danh mục {selectedCategory ? "(đã chọn)" : ""}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Dropdown content - chỉ hiện khi mở */}
      {isOpen && (
        <View className="mt-3 mb-6 bg-gray-50 rounded-xl">
          <View className="max-h-80">
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
            >
              {/* Loading */}
              {isLoading === true && (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-center text-gray-500 mt-4">
                    Đang tải danh mục...
                  </Text>
                </View>
              )}

              {/* Error với nút Thử lại + log chi tiết */}
              {isLoading === false && fetchError != null && (
                <View className="py-12 items-center px-4">
                  <Ionicons name="alert-circle" size={48} color="#EF4444" />
                  <Text className="text-center text-red-600 font-medium mt-3">
                    Không thể tải danh mục
                  </Text>
                  <Text className="text-center text-gray-500 mt-2 text-sm">
                    Vui lòng kiểm tra kết nối mạng
                  </Text>

                  {/* Nút retry */}
                  <TouchableOpacity
                    onPress={handleRetry}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-semibold">Thử lại</Text>
                  </TouchableOpacity>

                  {/* Debug chi tiết chỉ hiện ở dev */}
                  {__DEV__ && (
                    <Text className="text-xs text-gray-400 mt-4 text-center px-4">
                      Error: {(fetchError as any)?.message || "Unknown error"}
                    </Text>
                  )}
                </View>
              )}

              {/* Empty */}
              {isLoading === false &&
                fetchError == null &&
                categories.length === 0 && (
                  <View className="py-12 items-center">
                    <Ionicons name="information-circle" size={48} color="#6B7280" />
                    <Text className="text-center text-gray-500 mt-4">
                      Không có danh mục nào
                    </Text>
                  </View>
                )}

              {/* List */}
              {isLoading === false &&
                fetchError == null &&
                categories.length > 0 && (
                  <>
                    {categories.map((item) => (
                      <TouchableOpacity
                        key={item.categoryId}
                        onPress={() => handleSelect(item.categoryId)}
                        className="py-3 flex-row items-center"
                        activeOpacity={0.7}
                      >
                        <View className="mr-3">
                          {selectedCategory === item.categoryId ? (
                            <View className="w-5 h-5 rounded-full bg-blue-600 items-center justify-center">
                              <View className="w-2 h-2 rounded-full bg-white" />
                            </View>
                          ) : (
                            <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </View>
                        <Text
                          className={`text-base ${
                            selectedCategory === item.categoryId
                              ? "font-semibold text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {item.categoryName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};