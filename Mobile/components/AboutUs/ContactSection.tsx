import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { aboutData } from "@/Data/aboutUs-data";

export function ContactSection() {
  const { contact } = aboutData;

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="py-12 px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-10 text-text">
        Liên hệ nhanh
      </Text>

      <View className="flex-row justify-center gap-12">
        <Pressable
          onPress={() => openLink(contact.facebook)}
          className="items-center gap-3 active:opacity-70"
        >
          <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center">
            <Ionicons name="logo-facebook" size={32} color="white" />
          </View>
          <Text className="text-base font-medium text-text">Facebook</Text>
        </Pressable>

        <Pressable
          onPress={() => openLink(contact.zalo)}
          className="items-center gap-3 active:opacity-70"
        >
          <View className="w-16 h-16 bg-green-500 rounded-2xl items-center justify-center">
            <Ionicons name="chatbubble-ellipses" size={32} color="white" />
          </View>
          <Text className="text-base font-medium text-text">Zalo</Text>
        </Pressable>
      </View>
    </View>
  );
}
