import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../Utils/utils";

interface Product {
  productId: string;
  productName: string;
  productImage: string[];
  productPrice: number;
  supplierName: string;
  colorName?: string;
  categoryName?: string;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const mainImage = product.productImage?.[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="flex-1 bg-white rounded-2xl m-1.5 border border-gray-100 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: Platform.OS === "android" ? 2 : 0,
      }}
    >
      {/* Image */}
      <View className="w-full h-36 bg-gray-50">
        {mainImage ? (
          <Image source={{ uri: mainImage }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="image-outline" size={28} color="#D1D5DB" />
          </View>
        )}

        {onToggleFavorite && (
          <TouchableOpacity
            onPress={onToggleFavorite}
            hitSlop={8}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View className="p-2.5">
        {!!product.supplierName && (
          <View className="self-start bg-blue-50 px-2 py-0.5 rounded-md mb-1.5">
            <Text className="text-[11px] font-medium text-blue-600">{product.supplierName}</Text>
          </View>
        )}

        <Text className="text-[13px] font-semibold text-gray-900 leading-[17px]" numberOfLines={2}>
          {product.productName}
        </Text>

        <Text className="text-base font-bold text-red-600 mt-1.5 mb-2.5">
          {formatCurrency(product.productPrice)}
        </Text>

        <View className="flex-row items-center justify-center border border-blue-600 py-2 rounded-full">
          <Text className="text-blue-600 font-semibold text-[12px] mr-1">Xem chi tiết</Text>
          <Ionicons name="arrow-forward" size={13} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
};