
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ColorCardProps {
  item: {
    colorId: string;
    colorName: string;
    colorCode: string;
    colorImg: string;
  };
  onPress: () => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-6 mx-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
   
      <Image
        source={{ uri: item.colorImg || 'https://via.placeholder.com/300?text=No+Image' }}
        className="w-full h-48"
        resizeMode="cover"
      />

      {/* Thông tin bên dưới */}
      <View className="p-4">
        {/* Mã màu - nổi bật nhất */}
        <Text className="text-2xl font-black text-gray-900 text-center mb-2">
          {item.colorCode}
        </Text>

        {/* Tên màu */}
        <Text className="text-lg font-medium text-gray-700 text-center">
          {item.colorName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};