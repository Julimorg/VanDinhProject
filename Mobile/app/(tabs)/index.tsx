import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

import { HeroSection } from "@/components/home/HeroSection";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { StatsSection } from "@/components/home/StatsSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { ProductCategoriesSection } from "@/components/home/ProductCategoriesSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BrandsGallerySection } from "@/components/home/BrandsGallerySection";
import { useRefresh } from "@/context/RefreshContextType ";
import { RefreshableLayout } from "@/components/RefreshableLayout";

export default function HomeScreen() {
  const { refreshApp } = useRefresh();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <RefreshableLayout onRefresh={refreshApp}>
      <Animated.ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <HeroSection />
        <BannerCarousel />
        <StatsSection />
        <HighlightsSection />
        <ProductCategoriesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <BrandsGallerySection />
        {/* <View className="h-32" /> */}
      </Animated.ScrollView>
    </RefreshableLayout>
  );
}
