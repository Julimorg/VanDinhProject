import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  keyword: string;
  onChangeKeyword: (text: string) => void;
  isSearching?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onChangeKeyword,
  isSearching = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="px-4 pt-2 pb-2 bg-white">
      <View
        className={`flex-row items-center bg-gray-100 rounded-xl px-3 py-2 border ${
          isFocused ? "border-blue-400" : "border-transparent"
        }`}
      >
        <Ionicons name="search" size={18} color={isFocused ? "#3B82F6" : "#9CA3AF"} />
        <TextInput
          className="flex-1 ml-2 text-sm text-gray-800 py-0"
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#9CA3AF"
          value={keyword}
          onChangeText={onChangeKeyword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {isSearching && keyword.length > 0 && (
          <ActivityIndicator size="small" color="#3B82F6" className="mr-1" />
        )}
        {keyword.length > 0 && !isSearching && (
          <TouchableOpacity
            onPress={() => onChangeKeyword("")}
            className="ml-1 bg-gray-200 rounded-full p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={14} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};