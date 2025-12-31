import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  keyword: string;
  onChangeKeyword: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ keyword, onChangeKeyword }) => {
  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row items-center bg-white border border-gray-200 px-4 py-3.5 rounded-2xl">
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-900"
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#9CA3AF"
          value={keyword}
          onChangeText={onChangeKeyword}
        />
        {keyword.length > 0 && (
          <TouchableOpacity 
            onPress={() => onChangeKeyword('')}
            className="ml-2 p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
