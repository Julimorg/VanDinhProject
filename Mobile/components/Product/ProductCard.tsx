// components/ProductCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Product {
  productId: string;
  productName: string;
  productImage: string[];
  productVolume?: string;
  productUnit?: string;
  productQuantity: number;
  productPrice: number;
  supplierName: string;
  colorName: string;
  categoryName: string;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const mainImage = product.productImage?.[0] || "https://via.placeholder.com/400x500";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="flex-1 bg-white rounded-2xl overflow-hidden m-2 shadow-lg"
    >
      <Image source={{ uri: mainImage }} className="w-full h-48" resizeMode="cover" />

      <View className="p-4">
        <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={2}>
          {product.productName}
        </Text>

        <Text className="text-sm text-gray-500 mb-1">
          {product.categoryName} • {product.supplierName}
        </Text>

        {product.colorName && (
          <Text className="text-sm text-gray-600 mb-2">
            Màu: {product.colorName}
          </Text>
        )}

        {product.productVolume && product.productUnit && (
          <Text className="text-sm text-gray-600 mb-2">
            Dung tích: {product.productVolume} {product.productUnit}
          </Text>
        )}

        <Text className="text-xl font-bold text-pink-600 mb-3">
          {product.productPrice.toLocaleString("vi-VN")} ₫
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center justify-center bg-blue-600 py-2.5 rounded-xl"
        >
          <Text className="text-white font-semibold mr-2">Xem chi tiết</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};