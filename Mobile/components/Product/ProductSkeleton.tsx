import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 6 }) => {
  return (
    <View className="flex-row flex-wrap justify-between">
      {Array.from({ length: count }).map((_, index) => (
        <View 
          key={index} 
          className="w-[48%] bg-white rounded-xl p-3 mb-4 shadow-sm"
        >
          {/* Image skeleton */}
          <Skeleton
            colorMode="light"
            width="100%"
            height={160}
            radius={12}
          />
          
          {/* Title skeleton */}
          <View className="mt-3">
            <Skeleton
              colorMode="light"
              width="100%"
              height={16}
              radius={4}
            />
            <View className="mt-2">
              <Skeleton
                colorMode="light"
                width="70%"
                height={16}
                radius={4}
              />
            </View>
          </View>
          
          {/* Price & Stock skeleton */}
          <View className="mt-3 flex-row items-center justify-between">
            <Skeleton
              colorMode="light"
              width={80}
              height={20}
              radius={6}
            />
            <Skeleton
              colorMode="light"
              width={60}
              height={18}
              radius={6}
            />
          </View>
          
          {/* Button skeleton */}
          <View className="mt-3">
            <Skeleton
              colorMode="light"
              width="100%"
              height={40}
              radius={10}
            />
          </View>
        </View>
      ))}
    </View>
  );
};