
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPinIcon, PhoneIcon } from 'react-native-heroicons/outline';

interface SupplierCardProps {
  item: {
    supplierId: string;
    supplierName: string;
    supplierAddress: string;
    supplierPhone: string;
    supplierEmail: string;
    supplierImg?: string;
  };
  onPress: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mx-5 my-4 bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
    >
 
      <Image
        source={{
          uri: item.supplierImg || 'https://via.placeholder.com/600x400?text=No+Image',
        }}
        className="w-full h-64"
        resizeMode="cover"
      />

      {/* Nội dung bên dưới - trắng đen sắc nét */}
      <View className="p-6 bg-white">
        {/* Tên nổi bật nhất */}
        <Text className="text-3xl font-black text-black mb-4 tracking-tight">
          {item.supplierName}
        </Text>

        {/* Địa chỉ */}
        <View className="flex-row items-center mb-3">
          <MapPinIcon size={22} color="#374151" />
          <Text className="ml-3 text-lg text-gray-700 font-medium">
            {item.supplierAddress}
          </Text>
        </View>

        {/* Phone */}
        <View className="flex-row items-center">
          <PhoneIcon size={22} color="#374151" />
          <Text className="ml-3 text-lg text-gray-700 font-medium">
            {item.supplierPhone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};