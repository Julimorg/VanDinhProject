import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import Toast from "react-native-toast-message";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { RefreshProvider } from "../context/RefreshContextType ";
import { QueryProvider } from "../provider/QueryProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <RefreshProvider>
      <GluestackUIProvider>
        <QueryProvider>
          <Toast />
          {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="ProductDetail"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
          {/* </ThemeProvider> */}
        </QueryProvider>
      </GluestackUIProvider>
    </RefreshProvider>
  );
}
