import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FilterButtonProps {
  onPress: () => void;
  hasActiveFilters?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  onPress, 
  hasActiveFilters = false 
}) => {
  return (
    <View className="px-4 py-3 border-t border-gray-100">
      <TouchableOpacity
        onPress={onPress}
        className={`
          flex-row items-center justify-center py-3 px-4 rounded-xl
          ${hasActiveFilters ? 'bg-blue-600' : 'bg-gray-100'}
        `}
        activeOpacity={0.7}
      >
        <View className="relative">
          <Ionicons 
            name="funnel" 
            size={20} 
            color={hasActiveFilters ? "#FFF" : "#374151"} 
          />
          {hasActiveFilters && (
            <View className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
          )}
        </View>
        
        <Text 
          className={`
            ml-2 font-semibold text-base
            ${hasActiveFilters ? 'text-white' : 'text-gray-700'}
          `}
        >
          {hasActiveFilters ? 'Đang lọc' : 'Bộ lọc'}
        </Text>
        
        {hasActiveFilters && (
          <View className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full">
            <Text className="text-white text-xs font-bold">●</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};