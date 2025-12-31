
import React from 'react';
import { View, Text, Image, ImageBackground, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { homeData } from '@/Data/home-data';

Dimensions.get('window');

const BRAND_CARD_WIDTH = 340;

const brandBackgrounds = [
  require('@/assets/products/product_2.jpg'),     
  require('@/assets/products/product_1.png'),   
  require('@/assets/products/product_2.jpg'),     
  require('@/assets/products/product_1.png'),     
  require('@/assets/products/product_2.jpg'),        
];

export function BrandsGallerySection() {
  const brands = homeData.brands;
  const firstGalleryRow = homeData.gallery.slice(0, 2);
  const secondGalleryRow = homeData.gallery.slice(2);

  const renderBrandItem = ({ item, index }: { item: typeof brands[0]; index: number }) => {

    const backgroundImage = brandBackgrounds[index % brandBackgrounds.length];

    return (
      <ImageBackground
        source={backgroundImage}
        blurRadius={3}
        className="w-full h-56 rounded-3xl overflow-hidden justify-center items-center shadow-2xl"
      >
       
        <View className="absolute inset-0 bg-black/50" />

        {/* Nội dung text */}
        <Text className="text-white text-5xl font-extrabold tracking-widest">
          {item.name}
        </Text>
        <Text className="text-white/90 text-xl mt-3 font-semibold">
          Đối tác chính thức
        </Text>
      </ImageBackground>
    );
  };

  return (
    <View className="py-12 px-6 bg-white">
 
      <Text className="text-3xl font-bold text-center mb-12 text-text">
        Đối tác thương hiệu
      </Text>

      <Carousel
        loop={true}
        width={BRAND_CARD_WIDTH}
        height={224} 
        autoPlay={true}
        autoPlayInterval={5000}
        data={brands}
        scrollAnimationDuration={1200}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onConfigurePanGesture={(g) => {
          'worklet';
          g.activeOffsetX([-20, 20]);
        }}
        renderItem={renderBrandItem}
      />


      <Text className="text-3xl font-bold text-center mb-10 mt-16 text-text">
        Thư viện công trình thực tế
      </Text>


      <View className="flex-row justify-between gap-4 mb-6">
        {firstGalleryRow.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </View>


      <View className="flex-row justify-center">
        {secondGalleryRow.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

function GalleryItem({ item }: { item: typeof homeData.gallery[0] }) {
  return (
    <View className="w-[48%] rounded-2xl overflow-hidden shadow-xl bg-white">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-60"
        resizeMode="cover"
      />
      <View className="p-5">
        <Text className="text-xl font-bold text-text">{item.title}</Text>
        <Text className="text-sm text-muted mt-2 line-clamp-3">
          {item.description}
        </Text>
      </View>
    </View>
  );
}