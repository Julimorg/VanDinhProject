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

  const handleClear = () => {
    onChangeKeyword("");
  };

  return (
    <View className="px-4 py-3 bg-white">
      <View 
        className={`
          flex-row items-center bg-gray-100 rounded-xl px-4 py-3
          ${isFocused ? 'border-2 border-blue-500' : 'border-2 border-transparent'}
        `}
      >
        {/* Search Icon */}
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? "#3B82F6" : "#9CA3AF"} 
        />

        {/* Text Input */}
        <TextInput
          className="flex-1 ml-3 text-base text-gray-800"
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
          <ActivityIndicator 
            size="small" 
            color="#3B82F6" 
            className="mr-2"
          />
        )}

        {/* Clear Button */}
        {keyword.length > 0 && !isSearching && (
          <TouchableOpacity
            onPress={handleClear}
            className="ml-2 bg-gray-200 rounded-full p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};