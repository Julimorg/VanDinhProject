import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SupplierDropdown } from "./SupplierDropdown";
import { CategoryDropdown } from "./CategoryDropdown";

interface FilterSidebarProps {
  visible: boolean;
  selectedCategory: string | null;
  selectedSupplier: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSupplier: (supplierId: string | null) => void;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  selectedCategory,
  selectedSupplier,
  onSelectCategory,
  onSelectSupplier,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleReset = () => {
    onSelectSupplier(null);
    onSelectCategory(null);
    console.log("Đã xóa tất cả bộ lọc");
  };

  const handleApply = () => {
    console.log("Áp dụng filter:", {
      category: selectedCategory,
      supplier: selectedSupplier,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{
              opacity: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
            }}
          />
        </TouchableWithoutFeedback>

        {/* Sidebar */}
        <TouchableWithoutFeedback>
          <Animated.View
            className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
            style={{
              transform: [{ translateX: slideAnim }],
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-8 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-black">Bộ lọc</Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Danh mục Section */}
              <View className="mt-6 mb-4">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  DANH MỤC
                </Text>
                <CategoryDropdown
                  selectedCategory={selectedCategory || undefined}
                  onSelectCategory={onSelectCategory}
                />
              </View>

              {/* Nhà cung cấp Section */}
              <View className="my-4">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  NHÀ CUNG CẤP
                </Text>
                <SupplierDropdown
                  selectedSupplier={selectedSupplier || undefined}
                  onSelectSupplier={onSelectSupplier}
                />
              </View>

              {/* Khoảng giá Section (placeholder) */}
              <View className="my-4">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  KHOẢNG GIÁ
                </Text>
                <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Text className="text-sm text-gray-600 mb-2">Từ</Text>
                  <Text className="text-lg font-semibold text-black mb-3">
                    0₫
                  </Text>
                  <Text className="text-sm text-gray-600 mb-2">Đến</Text>
                  <Text className="text-lg font-semibold text-black">
                    50,000,000₫
                  </Text>
                </View>
              </View>

              {/* Sắp xếp Section (placeholder) */}
              <View className="my-4 mb-8">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  SẮP XẾP
                </Text>
                <TouchableOpacity
                  className="flex-row items-center py-3.5 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-black bg-black mr-3">
                    <View className="w-2 h-2 rounded-full bg-white m-auto" />
                  </View>
                  <Text className="text-base font-semibold text-black">
                    Mới nhất
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="px-6 py-4 border-t border-gray-200 bg-white">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 py-3.5 rounded-xl"
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <Text className="text-center text-black font-semibold text-base">
                    Xóa lọc
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-black py-3.5 rounded-xl"
                  onPress={handleApply}
                  activeOpacity={0.8}
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Áp dụng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};