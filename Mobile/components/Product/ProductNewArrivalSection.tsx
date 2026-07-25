import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetProductNewArrival } from "../../hooks/Product/useGetProductNewArrival";
import { formatCurrency } from "../../Utils/utils";

interface ProductNewArrivalSectionProps {
  onPressItem: (productId: string) => void;
}

const CARD_WIDTH = 148;
const CARD_GAP = 12;

const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity, width: CARD_WIDTH, marginRight: CARD_GAP }}
      className="bg-white rounded-2xl border border-gray-100 p-2"
    >
      <View className="w-full h-28 rounded-xl bg-gray-200" />
      <View className="h-3 bg-gray-200 rounded mt-2.5 w-4/5" />
      <View className="h-3 bg-gray-200 rounded mt-1.5 w-3/5" />
      <View className="h-4 bg-gray-200 rounded mt-2 w-2/5" />
    </Animated.View>
  );
};

export const ProductNewArrivalSection: React.FC<ProductNewArrivalSectionProps> = ({
  onPressItem,
}) => {
  const { data, isLoading, error } = useGetProductNewArrival();
  const items = data?.data ?? [];

  // Section phụ trợ: lỗi hoặc rỗng thì ẩn hẳn, không làm phiền UX chính của trang
  if (!isLoading && (error || items.length === 0)) return null;

  return (
    <View className="bg-white pt-3 pb-4 mb-2 border-b-8 border-gray-50">
      <View className="flex-row items-center px-4 mb-3">
        <View className="w-7 h-7 rounded-full bg-orange-50 items-center justify-center mr-2">
          <Ionicons name="sparkles" size={14} color="#EA580C" />
        </View>
        <Text className="text-[15px] font-bold text-gray-900">Hàng mới về</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => (
              <TouchableOpacity
                key={item.productId}
                onPress={() => onPressItem(item.productId)}
                activeOpacity={0.9}
                style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <View className="w-full h-28 bg-gray-50">
                  {item.productImage?.[0] ? (
                    <Image source={{ uri: item.productImage[0] }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <Ionicons name="image-outline" size={22} color="#D1D5DB" />
                    </View>
                  )}
                  <View className="absolute top-1.5 left-1.5 bg-orange-500 px-1.5 py-0.5 rounded-md">
                    <Text className="text-white text-[10px] font-bold">MỚI</Text>
                  </View>
                </View>

                <View className="p-2">
                  {!!item.supplierName && (
                    <Text className="text-[10px] font-medium text-blue-600 mb-0.5" numberOfLines={1}>
                      {item.supplierName}
                    </Text>
                  )}
                  <Text className="text-[12px] font-semibold text-gray-900 leading-[15px]" numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text className="text-[13px] font-bold text-red-600 mt-1.5">
                    {formatCurrency(item.productPrice)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
};