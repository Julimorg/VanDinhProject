import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterSidebarProps {
  visible: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  onChangePriceRange: (min: number | null, max: number | null) => void;
  onClose: () => void;
}

const PRICE_PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Dưới 500.000đ", min: null, max: 500_000 },
  { label: "500.000đ - 1.000.000đ", min: 500_000, max: 1_000_000 },
  { label: "1.000.000đ - 3.000.000đ", min: 1_000_000, max: 3_000_000 },
  { label: "Trên 3.000.000đ", min: 3_000_000, max: null },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  minPrice,
  maxPrice,
  onChangePriceRange,
  onClose,
}) => {
  const [draftMin, setDraftMin] = useState<number | null>(minPrice);
  const [draftMax, setDraftMax] = useState<number | null>(maxPrice);

  useEffect(() => {
    setDraftMin(minPrice);
    setDraftMax(maxPrice);
  }, [minPrice, maxPrice, visible]);

  const handleReset = () => {
    setDraftMin(null);
    setDraftMax(null);
  };

  const handleApply = () => {
    onChangePriceRange(draftMin, draftMax);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0 bg-black/60" />
        </TouchableWithoutFeedback>

        <SafeAreaView edges={["top", "bottom"]} className="absolute right-0 top-0 bottom-0 w-80">
          <View className="flex-1 bg-white rounded-l-3xl shadow-2xl">
            <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-black">Bộ lọc nâng cao</Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-base font-bold text-black mb-4 tracking-wide">KHOẢNG GIÁ</Text>
              {PRICE_PRESETS.map((preset) => {
                const active = draftMin === preset.min && draftMax === preset.max;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => {
                      setDraftMin(preset.min);
                      setDraftMax(preset.max);
                    }}
                    className="flex-row items-center py-3 border-b border-gray-100"
                    activeOpacity={0.7}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                        active ? "border-black bg-black" : "border-gray-300"
                      }`}
                    >
                      {active && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Text className={`text-base ${active ? "font-semibold text-black" : "text-gray-700"}`}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View className="px-6 py-4 border-t border-gray-200 bg-white rounded-bl-3xl">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 py-3.5 rounded-xl"
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <Text className="text-center text-black font-semibold text-base">Xóa lọc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-black py-3.5 rounded-xl"
                  onPress={handleApply}
                  activeOpacity={0.8}
                >
                  <Text className="text-center text-white font-semibold text-base">Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};