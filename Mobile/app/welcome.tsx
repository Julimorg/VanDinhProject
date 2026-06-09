import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import * as Updates from "expo-updates";

export default function WelcomeScreen() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  // ── Network check ──────────────────────────────────────────────────────────
  const checkNetwork = useCallback(async () => {
    setChecking(true);
    const state = await NetInfo.fetch();
    const connected = state.isConnected && state.isInternetReachable !== false;

    setIsConnected(!!connected);
    setChecking(false);

    if (!connected) {
      Toast.show({
        type: "error",
        text1: "Không có kết nối mạng",
        text2: "Vui lòng kiểm tra Wi-Fi hoặc dữ liệu di động.",
        visibilityTime: 4000,
        position: "top",
      });
    }
  }, []);

  // ── Subscribe NetInfo + initial check ─────────────────────────────────────
  useEffect(() => {
    checkNetwork();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;
      setIsConnected(!!connected);
    });

    return () => unsubscribe();
  }, [checkNetwork]);

  // ── Auto-redirect khi có mạng ─────────────────────────────────────────────
  useEffect(() => {
    if (!isConnected || checking) return;

    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2800);

    return () => clearTimeout(timer);
  }, [isConnected, checking]);

  // ── Refresh ───────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      checkNetwork();
    }
  }, [checkNetwork]);

  const offlineMode = !checking && isConnected === false;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center items-center px-8">
        <Animated.View entering={FadeIn.duration(1200)} className="items-center">

          {/* Logo */}
          <View className="w-44 h-44 rounded-full overflow-hidden bg-gray-100 border border-gray-200 items-center justify-center mb-12">
            <Image
              source={require("../assets/logo.jpg")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Tên thương hiệu */}
          <Text className="text-blue-600 text-6xl font-black text-center tracking-widest leading-tight">
            Vạn Dinh
          </Text>

          {/* Tagline chính */}
          <Text className="text-gray-900 text-xl font-bold text-center mt-5">
            Chuyên cung cấp sơn chất lượng cao
          </Text>

          {/* Tagline phụ */}
          <Text className="text-gray-500 text-base text-center mt-3 max-w-xs leading-relaxed">
            Đồng hành cùng mọi công trình – bền đẹp theo thời gian
          </Text>

          {/* Trạng thái */}
          <View className="mt-14 items-center gap-3">
            {checking ? (
              <>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-500 text-sm font-medium mt-3">
                  Đang kiểm tra kết nối...
                </Text>
              </>
            ) : offlineMode ? (
              <>
                <Text className="text-red-600 text-sm font-semibold">
                  Không có kết nối internet
                </Text>
                <TouchableOpacity
                  className="bg-blue-600 rounded-xl px-8 py-4 mt-2 active:opacity-80"
                  onPress={handleRefresh}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-base">
                    Thử lại
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-500 text-sm font-medium mt-3">
                  Đang tải ứng dụng...
                </Text>
              </>
            )}
          </View>

        </Animated.View>
      </View>

      <Toast />
    </SafeAreaView>
  );
}