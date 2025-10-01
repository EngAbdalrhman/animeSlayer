import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./globals.css";

import { SearchProvider } from "@/contexts/SearchContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SearchProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <>
          <StatusBar style="auto" hidden={true} />
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "",
              }}
            />
            <Stack.Screen
              name="index"
              options={{
                headerShown: true,
                title: "",
              }}
            />
            <Stack.Screen
              name="anime/[id]"
              options={{
                headerShown: false,
                title: "Anime Details",
              }}
            />

            <Stack.Screen
              name="movie/[id]"
              options={{
                headerShown: false,
                title: "Movie Details",
              }}
            />
          </Stack>
        </>
      </ThemeProvider>
    </SearchProvider>
  );
}
