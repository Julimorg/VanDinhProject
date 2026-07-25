import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 6 }) => {
  return (
    <View className="flex-row flex-wrap justify-between px-1">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="w-[48%] bg-white rounded-2xl p-2.5 mb-3 border border-gray-100"
        >
          <Skeleton colorMode="light" width="100%" height={144} radius={12} />

          <View className="mt-2.5">
            <Skeleton colorMode="light" width={70} height={16} radius={6} />
          </View>

          <View className="mt-2">
            <Skeleton colorMode="light" width="100%" height={14} radius={4} />
            <View className="mt-1.5">
              <Skeleton colorMode="light" width="60%" height={14} radius={4} />
            </View>
          </View>

          <View className="mt-2.5">
            <Skeleton colorMode="light" width={90} height={18} radius={4} />
          </View>

          <View className="mt-3">
            <Skeleton colorMode="light" width="100%" height={32} radius={999} />
          </View>
        </View>
      ))}
    </View>
  );
};