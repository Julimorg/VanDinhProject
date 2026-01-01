
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }: any) {
 useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)'); 
    }, 2500); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View className="items-center px-10">
     
        {/* <Image source={require('../assets/logo.png')} className="w-32 h-32 mb-10" resizeMode="contain" /> */}

        <Text className="text-5xl font-black text-gray-900 text-center leading-tight">
          Welcome to
        </Text>
        <Text className="text-6xl font-extrabold text-blue-600 mt-4 text-center">
          Vạn Định
        </Text>

        <Text className="text-lg text-gray-600 mt-12 text-center">
          Chuyên cung cấp sơn chất lượng cao
        </Text>
      </View>

      <View className="absolute bottom-20 items-center">
        <Text className="text-gray-400 text-sm">Đang tải ứng dụng...</Text>
      </View>
    </SafeAreaView>
  );
}