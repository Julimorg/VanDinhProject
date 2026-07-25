import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  selectedCategory: string | null;
  selectedSuppliers: string[];
  onRemoveCategory: () => void;
  onRemoveSupplier: (name: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  selectedCategory,
  selectedSuppliers,
  onRemoveCategory,
  onRemoveSupplier,
  onClearAll,
}) => {
  const chips: Chip[] = useMemo(() => {
    const list: Chip[] = [];
    if (selectedCategory) list.push({ key: "cat", label: selectedCategory, onRemove: onRemoveCategory });
    selectedSuppliers.forEach((s) =>
      list.push({ key: `sup-${s}`, label: s, onRemove: () => onRemoveSupplier(s) })
    );
    return list;
  }, [selectedCategory, selectedSuppliers, onRemoveCategory, onRemoveSupplier]);

  if (chips.length === 0) return null;

  return (
    <View className="flex-row items-center bg-white px-4 pb-3">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        {chips.map((chip) => (
          <View key={chip.key} className="flex-row items-center bg-blue-50 rounded-full pl-3 pr-2 py-1.5 mr-2">
            <Text className="text-blue-700 text-sm font-medium mr-1" numberOfLines={1}>
              {chip.label}
            </Text>
            <TouchableOpacity onPress={chip.onRemove} hitSlop={8}>
              <Ionicons name="close" size={14} color="#2563EB" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={onClearAll} className="ml-2">
        <Text className="text-gray-500 text-sm font-medium">Xóa tất cả</Text>
      </TouchableOpacity>
    </View>
  );
};