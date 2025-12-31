
import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const banners = [
  require('@/assets/products/product_1.png'),
  require('@/assets/products/product_2.jpg'),
  require('@/assets/products/product_3.jpg'),
];

export function BannerCarousel() {
  return (
    <View className="w-full h-60 rounded-2xl overflow-hidden mx-4 my-6">
      <Carousel
        loop
        width={width - 32}
        height={240}
        autoPlay={true}
        data={banners}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <Image source={item} resizeMode="cover" className="w-full h-full" />
        )}
      />
    </View>
  );
}