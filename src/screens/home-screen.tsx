import { useState } from "react";
import { Text, View } from "react-native";

import { AppShell } from "@/components/app-shell/app-shell";
import UsersScreen from "@/screens/users-screen";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<
    "inicio" | "usuarios" | "funciones"
  >("inicio");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "inicio" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#f8fafc", fontSize: 24, fontWeight: "700" }}>
            Inicio
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: 8 }}>
            Aquí va el contenido principal
          </Text>
        </View>
      ) : null}

      {activeTab === "usuarios" ? <UsersScreen /> : null}

      {activeTab === "funciones" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#f8fafc", fontSize: 24, fontWeight: "700" }}>
            Funciones
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: 8 }}>
            Acciones y herramientas
          </Text>
        </View>
      ) : null}
    </AppShell>
  );
}
