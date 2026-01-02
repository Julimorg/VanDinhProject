
import React from 'react';
import { View, TextInput } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

interface SupplierSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SupplierSearchBar: React.FC<SupplierSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm nhà cung cấp...',
}) => {
  return (
    <View className="mx-4 mt-4 mb-4">
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <MagnifyingGlassIcon size={22} color="#6b7280" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="ml-3 flex-1 text-base text-gray-800"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};