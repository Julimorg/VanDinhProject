import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetSupplierSelections } from "@/hooks/Product/useGetSupplierSelection";

interface SupplierDropdownProps {
  selectedSupplier?: string;
  onSelectSupplier: (supplierId: string | null) => void;
}

export const SupplierDropdown: React.FC<SupplierDropdownProps> = ({
  selectedSupplier,
  onSelectSupplier,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    error: fetchError,
  } = useGetSupplierSelections({
    enabled: isOpen,
  });

  const suppliers = data?.data || [];

  React.useEffect(() => {
    if (isOpen) console.log("🔽 Dropdown Nhà cung cấp ĐÃ MỞ");
  }, [isOpen]);

  React.useEffect(() => {
    if (isLoading) console.log(" Đang tải danh sách nhà cung cấp...");
    if (data) console.log(" Tải thành công:", suppliers.length, "items");
    if (fetchError) console.error(" Lỗi tải nhà cung cấp:", fetchError);
  }, [isLoading, data, fetchError]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (supplierId: string) => {
    onSelectSupplier(supplierId === selectedSupplier ? null : supplierId);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleDropdown}
        className="flex-row items-center justify-between py-4 border-b border-gray-100"
        activeOpacity={0.7}
      >
        <Text className="text-base font-medium text-gray-800">
          Nhà cung cấp {selectedSupplier ? "(đã chọn)" : ""}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="mt-3 mb-6 bg-gray-50 rounded-xl">
          <View className="max-h-80">
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {isLoading ? (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-center text-gray-500 mt-4">
                    Đang tải danh sách...
                  </Text>
                </View>
              ) : fetchError ? (
                <View className="py-12 items-center px-4">
                  <Ionicons name="alert-circle" size={48} color="#EF4444" />
                  <Text className="text-center text-red-600 font-medium mt-3">
                    Không thể tải danh sách
                  </Text>
                  {typeof fetchError === "object" &&
                    "message" in fetchError && (
                      <Text className="text-center text-red-500 mt-2 text-sm">
                        {(fetchError as any).message}
                      </Text>
                    )}
                </View>
              ) : suppliers.length === 0 ? (
                <View className="py-12 items-center">
                  <Ionicons
                    name="information-circle"
                    size={48}
                    color="#6B7280"
                  />
                  <Text className="text-center text-gray-500 mt-4">
                    Không có nhà cung cấp nào
                  </Text>
                </View>
              ) : (
                <>
                  {suppliers.map((item) => (
                    <TouchableOpacity
                      key={item.supplierId}
                      onPress={() => handleSelect(item.supplierId)}
                      className="py-3 flex-row items-center"
                      activeOpacity={0.7}
                    >
                      <View className="mr-3">
                        {selectedSupplier === item.supplierId ? (
                          <View className="w-5 h-5 rounded-full bg-blue-600 items-center justify-center">
                            <View className="w-2 h-2 rounded-full bg-white" />
                          </View>
                        ) : (
                          <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </View>
                      <Text
                        className={`text-base ${
                          selectedSupplier === item.supplierId
                            ? "font-semibold text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.supplierName}
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
