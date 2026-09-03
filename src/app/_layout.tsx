import {
    DarkTheme,
    DefaultTheme,
    Redirect,
    Slot,
    ThemeProvider,
    useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { FullPageLoader } from "@/components/full-page-loader";
import { AppProvider, useAppContext } from "@/context/app-context";

SplashScreen.preventAutoHideAsync();

function ProtectedRouteGate() {
  const { token, sessionReady } = useAppContext();
  const segments = useSegments();
  const isPrivateRoute = segments.length > 0;

  if (!sessionReady) {
    return <FullPageLoader />;
  }

  if (isPrivateRoute && !token) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AppProvider>
            <AnimatedSplashOverlay />
            <ProtectedRouteGate />
          </AppProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
