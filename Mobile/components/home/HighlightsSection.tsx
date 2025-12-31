
import React from 'react';
import { View, Text } from 'react-native';
import { homeData } from '@/Data/home-data';

export function HighlightsSection() {
  return (
    <View className="py-12 px-6 bg-white">
      <View className="gap-8">
        {homeData.highlights.map((item) => (
          <View key={item.id} className="flex-row items-start gap-4">
            <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center flex-shrink-0">
              <Text className="text-white text-2xl font-bold">{item.id}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-text mb-2">{item.title}</Text>
              <Text className="text-base text-muted leading-6">{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}