import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeData } from "@/Data/home-data";

const iconMap: Record<number, keyof typeof Ionicons.glyphMap> = {
  1: "pricetag",
  2: "shield-checkmark",
  3: "car",
  4: "headset",
};

export function FeaturesSection() {
  const firstRow = homeData.features.slice(0, 2);
  const secondRow = homeData.features.slice(2, 4);

  return (
    <View className="py-12 px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-10 text-text">
        Tại sao chọn Vạn Dinh?
      </Text>

      <View className="mb-10">
        <View className="flex-row justify-between gap-6">
          {firstRow.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </View>
      </View>

      <View>
        <View className="flex-row justify-between gap-6">
          {secondRow.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </View>
      </View>
    </View>
  );
}

function FeatureItem({ feature }: { feature: (typeof homeData.features)[0] }) {
  return (
    <View className="w-[48%] items-center">
      <View className="w-20 h-20 bg-primary-100 rounded-3xl items-center justify-center mb-5 shadow-sm">
        <Ionicons name={iconMap[feature.id]} size={36} color="#22c55e" />
      </View>
      <Text className="text-xl font-bold text-text text-center mb-3">
        {feature.title}
      </Text>
      <Text className="text-sm text-muted text-center leading-6 px-2">
        {feature.description}
      </Text>
    </View>
  );
}
