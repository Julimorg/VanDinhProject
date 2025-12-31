import { BankTransferSection } from "@/components/AboutUs/BankTransferSection";
import { CompanyInfo } from "@/components/AboutUs/CompanyInfo";
import { ContactSection } from "@/components/AboutUs/ContactSection";
import { QRCodeSection } from "@/components/AboutUs/QRCodeSection";
import { RefreshableLayout } from "@/components/RefreshableLayout";
import { useRefresh } from "@/context/RefreshContextType ";
import React from "react";
import { ScrollView } from "react-native";

export default function AboutScreen() {
  const { refreshApp } = useRefresh();

  return (
    <RefreshableLayout onRefresh={refreshApp}>
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <CompanyInfo />
        <ContactSection />
        <BankTransferSection />
        <QRCodeSection />
      </ScrollView>
    </RefreshableLayout>
  );
}
