import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterButtonProps {
  onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-center bg-black px-6 py-3.5 rounded-2xl mx-4 mb-4"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="options-outline" size={20} color="#FFFFFF" />
      <Text className="ml-2 text-base font-semibold text-white tracking-wide">
        BỘ LỌC & SẮP XẾP
      </Text>
    </TouchableOpacity>
  );
};
