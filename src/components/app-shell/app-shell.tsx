import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppContext } from "@/context/app-context";
import { styles } from "./app-shell.styles";

export type AppTab = "inicio" | "usuarios" | "funciones";

type AppShellProps = {
  activeTab: AppTab;
  children: ReactNode;
  onTabChange: (tab: AppTab) => void;
};

const tabs: Array<{
  key: AppTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "inicio", label: "Inicio", icon: "home-outline" },
  { key: "usuarios", label: "Usuarios", icon: "people-outline" },
  { key: "funciones", label: "Funciones", icon: "apps-outline" },
];

export function AppShell({ activeTab, children, onTabChange }: AppShellProps) {
  const { userEmail, logOut, isDarkMode, toggleTheme } = useAppContext();
  const contentProgress = useSharedValue(1);

  useEffect(() => {
    contentProgress.value = 0;
    contentProgress.value = withTiming(1, { duration: 220 });
  }, [activeTab, contentProgress]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentProgress.value,
    transform: [{ translateX: (1 - contentProgress.value) * 18 }],
  }));

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-18, 18])
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 60) {
        return;
      }

      const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
      const nextIndex =
        event.translationX < 0 ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex >= 0 && nextIndex < tabs.length) {
        runOnJS(onTabChange)(tabs[nextIndex].key);
      }
    });

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#050816" : "#F4F7FB" },
      ]}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#050816" : "#F4F7FB" },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDarkMode ? "#091222" : "#FFFFFF",
              borderBottomColor: isDarkMode ? "#162B46" : "#D8E0EA",
            },
          ]}
        >
          <View>
            <Text
              style={[styles.headerLabel, !isDarkMode && { color: "#087E8B" }]}
            >
              Sesión activa
            </Text>
            <Text
              style={[styles.userName, !isDarkMode && { color: "#172033" }]}
            >
              {userEmail ?? "Usuario"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              accessibilityLabel={
                isDarkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              onPress={toggleTheme}
              style={[
                styles.logoutButton,
                !isDarkMode && {
                  backgroundColor: "#E8F5F7",
                  borderColor: "#B7DDE2",
                },
              ]}
            >
              <Ionicons
                color={isDarkMode ? "#00D9FF" : "#087E8B"}
                name={isDarkMode ? "sunny-outline" : "moon-outline"}
                size={18}
              />
            </Pressable>
            <Pressable
              onPress={() => logOut()}
              style={[
                styles.logoutButton,
                !isDarkMode && {
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D8E0EA",
                },
              ]}
            >
              <Text
                style={[styles.logoutText, !isDarkMode && { color: "#172033" }]}
              >
                Salir
              </Text>
            </Pressable>
          </View>
        </View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View
            style={[
              styles.content,
              { backgroundColor: isDarkMode ? "#050816" : "#F4F7FB" },
              contentAnimatedStyle,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>

        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDarkMode ? "#091222" : "#FFFFFF",
              borderTopColor: isDarkMode ? "#162B46" : "#D8E0EA",
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange(tab.key)}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                  isActive && !isDarkMode && { backgroundColor: "#BFE7EA" },
                ]}
              >
                <Ionicons
                  color={
                    isActive
                      ? isDarkMode
                        ? "#ffffff"
                        : "#087E8B"
                      : isDarkMode
                        ? "#94a3b8"
                        : "#64748B"
                  }
                  name={tab.icon}
                  size={22}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                    !isDarkMode && { color: isActive ? "#087E8B" : "#64748B" },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
