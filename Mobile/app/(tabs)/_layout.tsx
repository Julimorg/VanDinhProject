import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HapticTab } from "@/components/haptic-tab";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tabBar,
            borderTopColor: Colors[colorScheme ?? "light"].border,
          },
          // Nếu muốn haptic khi nhấn tab
          ...(Platform.OS === "ios" && { tabBarButton: HapticTab }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="product"
          options={{
            title: "Sản phẩm",
            tabBarIcon: ({ color }) => (
              <Ionicons name="bag" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="supplier"
          options={{
            title: "Nhà cung cấp",
            tabBarIcon: ({ color }) => (
              <Ionicons name="business" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="color"
          options={{
            title: "Màu sắc",
            tabBarIcon: ({ color }) => (
              <Ionicons name="color-palette" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="about"
          options={{
            title: "About Us",
            tabBarIcon: ({ color }) => (
              <Ionicons name="information-circle" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
