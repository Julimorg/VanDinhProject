import { aboutData } from "@/Data/aboutUs-data";
import React from "react";
import { View, Text, Image } from "react-native";

export function QRCodeSection() {
  const { qrCodes } = aboutData;

  return (
    <View className="py-12 px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-10 text-text">
        Quét mã QR để thanh toán / liên hệ
      </Text>

      <View className="flex-row flex-wrap justify-center gap-8">
        {qrCodes.map((qr) => (
          <View key={qr.id} className="items-center">
            <Image
              source={qr.source}
              className="w-48 h-48 rounded-2xl shadow-lg"
              resizeMode="contain"
            />
            <Text className="text-base font-medium text-text mt-4 text-center">
              {qr.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
