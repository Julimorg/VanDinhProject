import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { homeData } from "@/Data/home-data";

export function ProductCategoriesSection() {
  const firstRow = homeData.productCategories.slice(0, 2);
  const secondRow = homeData.productCategories.slice(2, 4);

  return (
    <View className="py-12 px-6 bg-gray-50">
      <Text className="text-3xl font-bold text-center mb-10 text-text">
        Danh mục sản phẩm
      </Text>

      <View className="mb-8">
        <View className="flex-row justify-between gap-4">
          {firstRow.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </View>

      <View>
        <View className="flex-row justify-between gap-4">
          {secondRow.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </View>
    </View>
  );
}

function CategoryCard({
  category,
}: {
  category: (typeof homeData.productCategories)[0];
}) {
  return (
    <Pressable className="w-[48%] bg-white rounded-2xl overflow-hidden shadow-md active:opacity-80">
      <Image
        source={{ uri: category.imageUrl }}
        className="w-full h-56"
        resizeMode="cover"
      />
      <View className="p-5">
        <Text className="text-xl font-bold text-text">{category.name}</Text>
        <Text className="text-sm text-muted mt-2 line-clamp-3">
          {category.description}
        </Text>
      </View>
    </Pressable>
  );
}
