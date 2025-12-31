import { aboutData } from '@/Data/aboutUs-data';
import React from 'react';
import { View, Text, Linking, Pressable, ScrollView } from 'react-native';
import { Phone, Mail, MapPin, Globe } from 'lucide-react-native';

export function CompanyInfo() {
  const { company } = aboutData;

  const handlePress = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value.replace(/\s/g, '')}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'website':
        Linking.openURL(value);
        break;
      case 'address':
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(value)}`);
        break;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hero Section - Black Background */}
      <View className="bg-black px-6 pt-16 pb-12">
        <View className="border-l-4 border-white pl-4">
          <Text className="text-gray-400 text-xs font-medium tracking-widest uppercase mb-2">
            Về chúng tôi
          </Text>
          <Text className="text-white text-4xl font-bold leading-tight">
            {company.name}
          </Text>
        </View>
      </View>

      {/* Description Section */}
      <View className="px-6 py-12 bg-white">
        <Text className="text-gray-800 text-base leading-7 tracking-wide">
          {company.description}
        </Text>
      </View>

      {/* Divider */}
      <View className="mx-6 border-b border-gray-200" />

      {/* Contact Info Section */}
      <View className="px-6 py-12 bg-white">
        <Text className="text-black text-xl font-bold mb-8 tracking-tight">
          Thông tin liên hệ
        </Text>

        <View className="gap-4">
          {/* Address */}
          <Pressable
            onPress={() => handlePress('address', company.address)}
            className="bg-gray-50 p-4 rounded-lg active:bg-gray-100"
          >
            <View className="flex-row gap-4 items-start">
              <View className="bg-black w-10 h-10 rounded-full items-center justify-center mt-1">
                <MapPin color="white" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Địa chỉ
                </Text>
                <Text className="text-gray-900 text-base leading-6">
                  {company.address}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Phone */}
          <Pressable
            onPress={() => handlePress('phone', company.phone)}
            className="bg-gray-50 p-4 rounded-lg active:bg-gray-100"
          >
            <View className="flex-row gap-4 items-center">
              <View className="bg-black w-10 h-10 rounded-full items-center justify-center">
                <Phone color="white" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Điện thoại
                </Text>
                <Text className="text-gray-900 text-base font-medium">
                  {company.phone}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Email */}
          {company.email && (
            <Pressable
              onPress={() => handlePress('email', company.email)}
              className="bg-gray-50 p-4 rounded-lg active:bg-gray-100"
            >
              <View className="flex-row gap-4 items-center">
                <View className="bg-black w-10 h-10 rounded-full items-center justify-center">
                  <Mail color="white" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Email
                  </Text>
                  <Text className="text-gray-900 text-base font-medium">
                    {company.email}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Website */}
          {company.website && (
            <Pressable
              onPress={() => handlePress('website', company.website)}
              className="bg-gray-50 p-4 rounded-lg active:bg-gray-100"
            >
              <View className="flex-row gap-4 items-center">
                <View className="bg-black w-10 h-10 rounded-full items-center justify-center">
                  <Globe color="white" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    Website
                  </Text>
                  <Text className="text-gray-900 text-base font-medium">
                    {company.website}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {/* Footer Accent */}
      <View className="h-2 bg-black" />
    </ScrollView>
  );
}