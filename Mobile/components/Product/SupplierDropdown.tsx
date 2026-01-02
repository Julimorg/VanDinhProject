import React, { useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetSupplierSelections } from "@/hooks/Product/useGetSupplierSelection";

interface SupplierDropdownProps {
  selectedSupplier?: string;
  onSelectSupplier: (supplierName: string | null) => void;
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
        <View className="h-4 bg-gray-300 rounded-md w-2/3" />
      </View>
    </Animated.View>
  );
};

// Supplier Item với memo
const SupplierItem = memo<{
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
      ${isSelected ? 'bg-green-50' : 'bg-white'}
    `}
    activeOpacity={0.7}
  >
    <View className="mr-3">
      {isSelected ? (
        <View className="w-6 h-6 rounded-full bg-green-600 items-center justify-center">
          <Ionicons name="checkmark" size={16} color="#FFF" />
        </View>
      ) : (
        <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
      )}
    </View>
    <Text
      className={`text-base flex-1 ${
        isSelected ? "font-semibold text-green-600" : "text-gray-700"
      }`}
    >
      {item.supplierName}
    </Text>
    {isSelected && (
      <Ionicons name="chevron-forward" size={18} color="#10B981" />
    )}
  </TouchableOpacity>
));

SupplierItem.displayName = 'SupplierItem';

export const SupplierDropdown: React.FC<SupplierDropdownProps> = ({
  selectedSupplier,
  onSelectSupplier,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetSupplierSelections({
    enabled: isOpen,
  });

  const suppliers = data?.data || [];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (supplierName: string) => {
    onSelectSupplier(supplierName === selectedSupplier ? null : supplierName);
    console.log("✅ Đã chọn supplier:", supplierName);
  };

  const handleRetry = () => {
    console.log("🔄 Người dùng bấm Thử lại nhà cung cấp");
    refetch();
  };

  return (
    <View>
      {/* Header */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className={`
          flex-row items-center justify-between py-4 px-4 rounded-xl
          ${isOpen ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'}
        `}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center flex-1">
          <View className={`
            w-10 h-10 rounded-full items-center justify-center mr-3
            ${isOpen ? 'bg-green-600' : 'bg-gray-300'}
          `}>
            <Ionicons 
              name="business" 
              size={20} 
              color={isOpen ? "#FFF" : "#6B7280"} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Nhà cung cấp</Text>
            <Text className="text-base font-semibold text-gray-800">
              {selectedSupplier || "Chọn nhà cung cấp"}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color={isOpen ? "#10B981" : "#9CA3AF"}
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
                Không thể tải nhà cung cấp
              </Text>
              <Text className="text-center text-gray-500 text-sm mb-6">
                Vui lòng kiểm tra kết nối mạng và thử lại
              </Text>

              <TouchableOpacity
                onPress={handleRetry}
                className="bg-green-600 px-8 py-3.5 rounded-xl flex-row items-center shadow-sm"
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#FFF" />
                <Text className="text-white font-semibold ml-2">Thử lại</Text>
              </TouchableOpacity>

              {__DEV__ && typeof fetchError === "object" && "message" in fetchError && (
                <View className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">
                  <Text className="text-xs text-gray-600 text-center">
                    {(fetchError as any).message}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State */}
          {isLoading === false && fetchError == null && suppliers.length === 0 && (
            <View className="py-16 px-6 items-center">
              <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Ionicons name="business-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-center text-gray-600 font-medium text-base">
                Chưa có nhà cung cấp
              </Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Nhà cung cấp sẽ hiển thị ở đây
              </Text>
            </View>
          )}

          {/* List - DÙNG ScrollView thay vì FlatList */}
          {isLoading === false && fetchError == null && suppliers.length > 0 && (
            <ScrollView
              style={{ maxHeight: 320 }}
              contentContainerStyle={{ padding: 12 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {suppliers.map((item) => (
                <SupplierItem
                  key={item.supplierId}
                  item={item}
                  isSelected={selectedSupplier === item.supplierName}
                  onSelect={() => handleSelect(item.supplierName)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};