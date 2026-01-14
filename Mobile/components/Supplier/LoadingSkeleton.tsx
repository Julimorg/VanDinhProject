import React from 'react';
import { View } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

interface SupplierSkeletonProps {
  count?: number;
}

export const SupplierSkeleton: React.FC<SupplierSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="mx-5 my-4">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <ContentLoader 
              speed={1.2} 
              width="100%" 
              height={440}
              backgroundColor="#f3f3f3" 
              foregroundColor="#ecebeb"
            >
              {/* Image placeholder - 256px height (h-64 = 16*4 = 64*4 = 256px) */}
              <Rect x="0" y="0" rx="0" ry="0" width="100%" height="256" />
              
              {/* Content section - p-6 = 24px padding */}
              
              {/* Title - text-3xl font-black (large bold text) */}
              <Rect x="24" y="280" rx="8" ry="8" width="70%" height="28" />
              <Rect x="24" y="316" rx="8" ry="8" width="50%" height="28" />
              
              {/* Address row - flex-row with icon */}
              <Circle cx="36" cy="372" r="11" />
              <Rect x="60" y="361" rx="6" ry="6" width="75%" height="22" />
              
              {/* Phone row - flex-row with icon */}
              <Circle cx="36" cy="412" r="11" />
              <Rect x="60" y="401" rx="6" ry="6" width="60%" height="22" />
            </ContentLoader>
          </View>
        </View>
      ))}
    </>
  );
};

// Alternative version with more subtle animation
export const SupplierSkeletonAlt: React.FC<SupplierSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="mx-5 my-4">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <ContentLoader 
              speed={1.5} 
              width="100%" 
              height={440}
              backgroundColor="#F9FAFB" 
              foregroundColor="#F3F4F6"
            >
              {/* Image with gradient effect */}
              <Rect x="0" y="0" rx="0" ry="0" width="100%" height="256" />
              
              {/* Title lines */}
              <Rect x="24" y="280" rx="10" ry="10" width="65%" height="30" />
              <Rect x="24" y="318" rx="10" ry="10" width="45%" height="30" />
              
              {/* Address section */}
              <Rect x="24" y="370" rx="20" ry="20" width="22" height="22" />
              <Rect x="58" y="370" rx="8" ry="8" width="70%" height="22" />
              
              {/* Phone section */}
              <Rect x="24" y="410" rx="20" ry="20" width="22" height="22" />
              <Rect x="58" y="410" rx="8" ry="8" width="55%" height="22" />
            </ContentLoader>
          </View>
        </View>
      ))}
    </>
  );
};

// Minimalist version - faster, cleaner
export const SupplierSkeletonMinimal: React.FC<SupplierSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="mx-5 my-4">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            {/* Image skeleton */}
            <View className="w-full h-64 bg-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <View className="p-6 bg-white space-y-4">
              {/* Title */}
              <View className="space-y-3">
                <View className="h-7 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                <View className="h-7 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
              </View>
              
              {/* Address */}
              <View className="flex-row items-center space-x-3 mt-4">
                <View className="w-5.5 h-5.5 bg-gray-300 rounded-full animate-pulse" />
                <View className="h-5.5 bg-gray-200 rounded-md flex-1 animate-pulse" />
              </View>
              
              {/* Phone */}
              <View className="flex-row items-center space-x-3">
                <View className="w-5.5 h-5.5 bg-gray-300 rounded-full animate-pulse" />
                <View className="h-5.5 bg-gray-200 rounded-md w-3/5 animate-pulse" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};