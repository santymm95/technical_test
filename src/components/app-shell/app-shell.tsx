import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
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
  const { userEmail, logOut } = useAppContext();

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

        <View style={styles.content}>{children}</View>

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
