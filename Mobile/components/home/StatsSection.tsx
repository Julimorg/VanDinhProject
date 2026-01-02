import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { homeData } from '@/Data/home-data';

const AnimatedText = Animated.createAnimatedComponent(Text);

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
  const [displayNumber, setDisplayNumber] = useState('0');

  const targetNumber = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
  const suffix = value.replace(/[\d]/g, '').trim();

  useEffect(() => {
    animatedValue.value = withTiming(targetNumber, {
      duration: 2200,
    });
  }, [animatedValue, targetNumber]);

  useAnimatedReaction(
    () => animatedValue.value,
    (currentValue) => {
      const formatted = Math.floor(currentValue).toLocaleString('en-US');
      runOnJS(setDisplayNumber)(formatted);
    }
  );

  return (
    <View className="items-center mb-10 min-w-[120px]">
      <View className="flex-row items-end">
        {/* Số đếm animated */}
        <Text className="text-5xl font-bold text-black">{displayNumber}</Text>
        {/* Suffix cố định */}
        {suffix ? (
          <Text className="text-4xl font-bold text-black ml-1">{suffix}</Text>
        ) : null}
      </View>

      <Text className="text-gray-500 text-sm text-center mt-2">{label}</Text>
    </View>
  );
}