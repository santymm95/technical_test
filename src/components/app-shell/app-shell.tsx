import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

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
  const { userEmail, logOut } = useAppContext();
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Sesión activa</Text>
            <Text style={styles.userName}>{userEmail ?? "Usuario"}</Text>
          </View>

          <Pressable onPress={() => logOut()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        </View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange(tab.key)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Ionicons
                  color={isActive ? "#ffffff" : "#94a3b8"}
                  name={tab.icon}
                  size={22}
                />
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
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
