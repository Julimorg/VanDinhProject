import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";

export default function WelcomeScreen() {
  const logoUri = require('../assets/logo.jpg');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center items-center px-8">
        <Animated.View
          entering={FadeIn.duration(1400)}
          className="items-center"
        >
          {/* Logo placeholder */}
          <View className="w-44 h-44 mb-14 bg-gray-100 rounded-full items-center justify-center border border-gray-200 overflow-hidden">
            {logoUri ? (
              <Image
                source={logoUri}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-blue-600 text-7xl font-black">VD</Text>
            )}
          </View>

          {/* Tên công ty - fix lỗi bằng cách bọc chặt chẽ */}
          <Text className="text-blue-600 text-6xl font-black text-center leading-tight tracking-widest">
            Vạn Dinh
          </Text>

          {/* Slogan chính */}
          <Text className="text-gray-800 text-2xl font-bold mt-8 text-center">
            Chuyên cung cấp sơn chất lượng cao
          </Text>

          {/* Slogan phụ */}
          <Text className="text-gray-600 text-lg mt-5 text-center max-w-lg px-6">
            Đồng hành cùng mọi công trình – bền đẹp theo thời gian
          </Text>

          {/* Loading */}
          <View className="mt-20 items-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-600 text-base mt-4 font-medium">
              Đang tải ứng dụng...
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
