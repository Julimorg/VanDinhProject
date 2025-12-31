
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import  {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { homeData } from '@/Data/home-data';

export function StatsSection() {
  return (
    <View className="bg-white py-12 px-6">
      <View className="flex-row flex-wrap justify-around">
        {homeData.stats.map((stat) => (
          <AnimatedStatItem
            key={stat.id}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </View>
    </View>
  );
}

function AnimatedStatItem({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const animatedValue = useSharedValue(0);

  const targetNumber = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
  const suffix = value.replace(/\d/g, '');


  useEffect(() => {
    animatedValue.value = withTiming(targetNumber, { duration: 2200 });
  }, [animatedValue, targetNumber]);


  useAnimatedStyle(() => {
    return {};
  }, [animatedValue]);

  return (
    <View className="items-center mb-10 min-w-[120px]">
      <Text className="text-black text-5xl font-bold">
        {Math.floor(animatedValue.value)}
        <Text className="text-black text-4xl font-bold">{suffix}</Text>
      </Text>
      <Text className="text-muted text-sm text-center mt-2">{label}</Text>
    </View>
  );
}