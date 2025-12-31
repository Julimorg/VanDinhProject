
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { homeData } from '@/Data/home-data';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85; 

export function TestimonialsSection() {
  const testimonials = homeData.testimonials;

  const renderItem = ({ item }: { item: typeof testimonials[0] }) => (
    <View className="bg-white rounded-3xl p-8 shadow-xl h-full justify-center mx-4">
      {/* Stars */}
      <View className="flex-row justify-center mb-6">
        {[...Array(item.rating)].map((_, i) => (
          <Ionicons key={i} name="star" size={28} color="#fbbf24" />
        ))}
      </View>

      {/* Quote */}
      <Text className="text-lg italic text-text text-center leading-8 mb-8 px-4">
        {item.content}&quot;
      </Text>

      {/* Tên & vai trò */}
      <Text className="text-2xl font-bold text-text text-center">{item.name}</Text>
      <Text className="text-base text-muted text-center mt-2">{item.role}</Text>
    </View>
  );

  return (
    <View className="py-12 px-6 bg-primary-50">
      <Text className="text-3xl font-bold text-center mb-12 text-text">
        Khách hàng nói về chúng tôi
      </Text>

      <Carousel
        loop={true}
        width={CARD_WIDTH}
        height={360} 
        autoPlay={true}
        autoPlayInterval={6000} 
        data={testimonials}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.94,
          parallaxScrollingOffset: 50,  
        }}
     
        onConfigurePanGesture={(g) => {
          'worklet';
          g.activeOffsetX([-15, 15]); 
        }}
        renderItem={renderItem}
      />
    </View>
  );
}