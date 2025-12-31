
import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { homeData } from '@/Data/home-data';
import Animated, { 
  FadeInDown, 
  ZoomIn, 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  withSequence,
  withSpring 
} from 'react-native-reanimated';


export function HeroSection() {
  const { hero } = homeData;

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressButton = () => {
  
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1)
    );

    const contactLink = 'https://zalo.me/0123456789'; 
    

    Linking.openURL(contactLink).catch(() => {

    });
  };

  return (
    <View className="bg-amber-900 py-16 px-6"> 
      <Animated.View entering={FadeInDown.duration(800)}>
        <View className="items-center">
          <Text className="text-amber-50 text-4xl font-bold text-center leading-tight">
            {hero.title}
          </Text>

          <Animated.Text 
            entering={FadeInDown.delay(200).duration(800)}
            className="text-amber-100 text-xl font-semibold text-center mt-4"
          >
            {hero.subtitle}
          </Animated.Text>

          <Animated.Text 
            entering={FadeInDown.delay(400).duration(800)}
            className="text-amber-50/90 text-base text-center mt-6 px-4 leading-6"
          >
            {hero.description}
          </Animated.Text>

          <Animated.View entering={ZoomIn.delay(600).springify()}>
            <Pressable
              onPress={handlePressButton}
              className="mt-10 bg-amber-600 py-5 px-12 rounded-full active:opacity-90 shadow-lg"
            >
              <Animated.View style={animatedButtonStyle}>
                <Text className="text-white text-lg font-bold tracking-wider">
                  {hero.ctaText}
                </Text>
              </Animated.View>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}