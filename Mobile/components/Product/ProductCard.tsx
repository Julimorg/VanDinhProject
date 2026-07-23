import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { formatCurrency } from "../../Utils/utils";

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

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const mainImage =
    product.productImage?.[0] || "https://via.placeholder.com/400x500";

  const handlePress = () => {
    router.push({
      pathname: "/ProductDetail",
      params: { productId: product.productId },
    });
    // Nếu dùng react-navigation:
    // navigation.navigate('ProductDetail', { productId: product.productId });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="flex-1 bg-white rounded-2xl overflow-hidden m-2"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: Platform.OS === "android" ? 10 : 0,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: mainImage }}
        className="w-full h-48 bg-gray-100"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="p-4">
        <Text
          className="text-base font-bold text-gray-900 mb-1.5"
          numberOfLines={2}
        >
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
          <Text className="text-sm text-gray-600 mb-3">
            Dung tích: {product.productVolume} {product.productUnit}
          </Text>
        )}

        {/* Giá nổi bật */}
        <Text className="text-xl font-extrabold text-pink-600 mb-4">
          {formatCurrency(product.productPrice)}
        </Text>

        {/* Button CTA */}
        <TouchableOpacity
          onPress={handlePress}
          className="flex-row items-center justify-center bg-blue-600 py-3 rounded-xl"
          activeOpacity={0.9}
        >
          <Text className="text-white font-semibold text-base mr-2">
            Xem chi tiết
          </Text>

          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
