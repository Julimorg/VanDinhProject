
import React from 'react';
import { View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

export const SupplierSkeleton = () => (
  <View className="mx-4 mb-5">
    <ContentLoader speed={1} width={400} height={300} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
      <Rect x="0" y="0" rx="16" ry="16" width="100%" height="192" />
      <Rect x="16" y="208" rx="8" ry="8" width="200" height="24" />
      <Rect x="16" y="240" rx="6" ry="6" width="300" height="16" />
      <Rect x="16" y="265" rx="6" ry="6" width="250" height="16" />
    </ContentLoader>
  </View>
);