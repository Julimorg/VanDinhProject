import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetCategorySelection } from "../../hooks/Product/useGetCategorySelection";

interface CategoryIconRowProps {
  selectedCategory: string | null;
  onSelectCategory: (name: string | null) => void;
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  "sơn": "color-palette-outline",
  "chống thấm": "water-outline",
  "xi măng": "cube-outline",
  "gạch": "grid-outline",
  "keo dán": "layers-outline",
  "dụng cụ": "construct-outline",
};

const getIconFor = (name: string) => ICON_MAP[name.trim().toLowerCase()] ?? "pricetag-outline";

export const CategoryIconRow: React.FC<CategoryIconRowProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { data } = useGetCategorySelection({ enabled: true });
  const categories = useMemo(() => data?.data ?? [], [data]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
    >
      <TouchableOpacity onPress={() => onSelectCategory(null)} activeOpacity={0.7} className="items-center mr-5">
        <View
          className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
            selectedCategory === null ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-transparent"
          }`}
        >
          <Ionicons name="grid" size={22} color={selectedCategory === null ? "#2563EB" : "#6B7280"} />
        </View>
        <Text
          className={`text-xs mt-1.5 ${
            selectedCategory === null ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
        >
          Tất cả
        </Text>
      </TouchableOpacity>

      {categories.map((cat: any) => {
        const active = selectedCategory === cat.categoryName;
        return (
          <TouchableOpacity
            key={cat.categoryId}
            onPress={() => onSelectCategory(active ? null : cat.categoryName)}
            activeOpacity={0.7}
            className="items-center mr-5"
          >
            <View
              className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
                active ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-transparent"
              }`}
            >
              <Ionicons name={getIconFor(cat.categoryName)} size={22} color={active ? "#2563EB" : "#6B7280"} />
            </View>
            <Text
              className={`text-xs mt-1.5 ${active ? "text-blue-600 font-semibold" : "text-gray-600"}`}
              numberOfLines={1}
              style={{ maxWidth: 60, textAlign: "center" }}
            >
              {cat.categoryName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};