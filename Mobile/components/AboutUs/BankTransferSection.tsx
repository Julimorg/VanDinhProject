import { aboutData } from "@/Data/aboutUs-data";
import React from "react";
import { View, Text } from "react-native";

export function BankTransferSection() {
  const { bankAccounts } = aboutData;

  return (
    <View className="py-12 px-6 bg-gray-50">
      <Text className="text-3xl font-bold text-center mb-10 text-text">
        Thông tin chuyển khoản
      </Text>

      <View className="gap-6">
        {bankAccounts.map((account) => (
          <View key={account.id} className="bg-white rounded-2xl p-6 shadow-md">
            <Text className="text-xl font-bold text-text mb-3">
              {account.bankName}
            </Text>
            <Text className="text-base text-text">
              <Text className="font-semibold">Số tài khoản:</Text>{" "}
              {account.accountNumber}
            </Text>
            <Text className="text-base text-text mt-2">
              <Text className="font-semibold">Chủ tài khoản:</Text>{" "}
              {account.owner}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
