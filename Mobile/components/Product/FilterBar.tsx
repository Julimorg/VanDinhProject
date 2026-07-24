import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SortDropdown } from "./SortDropdown";
import { SupplierFilterDropdown } from "./SupplierDropdown";


interface FilterBarProps {
  onOpenAdvancedFilter: () => void;
  hasAdvancedFilters: boolean;
  sortValue: string;
  onChangeSort: (v: string) => void;
  selectedSuppliers: string[];
  onChangeSuppliers: (names: string[]) => void;
  viewMode: "grid" | "list";
  onToggleViewMode: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onOpenAdvancedFilter,
  hasAdvancedFilters,
  sortValue,
  onChangeSort,
  selectedSuppliers,
  onChangeSuppliers,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <View className="flex-row items-center bg-white pl-4 pr-2 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingRight: 8 }}
      >
        <TouchableOpacity
          onPress={onOpenAdvancedFilter}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          className={`flex-row items-center px-3 py-2 rounded-full border mr-2 ${
            hasAdvancedFilters ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
          }`}
        >
          <Ionicons name="filter-outline" size={15} color={hasAdvancedFilters ? "#2563EB" : "#374151"} />
          <Text
            className={`ml-1.5 text-[13px] font-medium ${
              hasAdvancedFilters ? "text-blue-700" : "text-gray-700"
            }`}
          >
            Bộ lọc
          </Text>
          <Ionicons
            name="chevron-down"
            size={13}
            color={hasAdvancedFilters ? "#2563EB" : "#9CA3AF"}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        <View className="mr-2">
          <SortDropdown value={sortValue} onChange={onChangeSort} />
        </View>

        <SupplierFilterDropdown selectedSuppliers={selectedSuppliers} onChangeSuppliers={onChangeSuppliers} />
      </ScrollView>

      <TouchableOpacity
        onPress={onToggleViewMode}
        activeOpacity={0.7}
        className="w-9 h-9 items-center justify-center rounded-full border border-gray-200 bg-white ml-2"
      >
        <Ionicons name={viewMode === "grid" ? "grid" : "list"} size={16} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};