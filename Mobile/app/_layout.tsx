import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { QueryProvider } from "@/provider/QueryProvider";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { RefreshProvider } from "@/context/RefreshContextType ";
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <RefreshProvider>
      <GluestackUIProvider>
        <QueryProvider>
          {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
          {/* </ThemeProvider> */}
        </QueryProvider>
        <Toast />
      </GluestackUIProvider>
    </RefreshProvider>
  );
}
