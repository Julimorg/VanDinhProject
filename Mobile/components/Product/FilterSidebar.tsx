import React, { useRef, useEffect, useState } from "react";
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
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280, // Smooth & not too slow
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
    setSelectedSupplier(null);
    setSelectedCategory(null);
    console.log("Xóa bộ lọc");
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1">
        {/* Backdrop với opacity */}
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

        {/* Sidebar trắng */}
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
                  onSelectCategory={(id) => setSelectedCategory(id)}
                />
              </View>

              {/* Nhà cung cấp Section */}
              <View className="my-4">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  NHÀ CUNG CẤP
                </Text>
                <SupplierDropdown
                  selectedSupplier={selectedSupplier || undefined}
                  onSelectSupplier={(id) => setSelectedSupplier(id)}
                />
              </View>

              {/* Khoảng giá Section */}
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

              {/* Sắp xếp Section */}
              <View className="my-4 mb-8">
                <Text className="text-base font-bold text-black mb-4 tracking-wide">
                  SẮP XẾP
                </Text>

                <TouchableOpacity
                  className="flex-row items-center py-3.5 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                  <Text className="text-base text-gray-700">Tên (A → Z)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center py-3.5 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                  <Text className="text-base text-gray-700">Tên (Z → A)</Text>
                </TouchableOpacity>

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

                <TouchableOpacity
                  className="flex-row items-center py-3.5 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                  <Text className="text-base text-gray-700">Giá tăng dần</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center py-3.5"
                  activeOpacity={0.7}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                  <Text className="text-base text-gray-700">Giá giảm dần</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer - Fixed Bottom */}
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
                  onPress={onClose}
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
