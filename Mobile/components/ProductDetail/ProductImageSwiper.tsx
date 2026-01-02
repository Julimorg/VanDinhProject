
import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const HEIGHT = screenWidth * 1.1; 

interface ProductImageCarouselProps {
  images: string[];
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images }) => {
  const progressValue = useSharedValue<number>(0);

  if (!images || images.length === 0) {
    return (
      <View className="w-full h-96 bg-gray-200 justify-center items-center rounded-2xl">
        <Image
          source={{ uri: 'https://via.placeholder.com/400' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View className="w-full">
      <Carousel
        loop={true}
        width={screenWidth}
        height={HEIGHT}
        autoPlay={false}
        data={images}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <View className="flex-1 justify-center items-center px-4">
            <Image
              source={{ uri: item }}
              className="w-full h-full rounded-2xl"
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Pagination dots đẹp, hiện đại */}
      {images.length > 1 && (
        <Pagination.Basic
          progress={progressValue}
          data={images}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#d1d5db', 
          }}
          activeDotStyle={{
            width: 24,
            backgroundColor: '#EC4899', 
          }}
          containerStyle={{ paddingVertical: 16 }}
        />
      )}
    </View>
  );
};