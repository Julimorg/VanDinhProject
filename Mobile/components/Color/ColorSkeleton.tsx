
import React from 'react';
import { View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

export const ColorSkeleton = () => (
  <View className="mx-4 mb-8">
    <ContentLoader
      speed={1.2}
      width={400}
      height={480}
      viewBox="0 0 400 480"
      backgroundColor="#f0f0f0"
      foregroundColor="#e0e0e0"
    >

      <Rect x="0" y="0" rx="24" ry="24" width="400" height="320" />


      <Rect x="80" y="360" rx="16" ry="16" width="240" height="48" />


      <Rect x="100" y="420" rx="12" ry="12" width="200" height="32" />
    </ContentLoader>
  </View>
);