import { ActivityIndicator, Text, View } from "react-native";

import { useAppContext } from "@/context/app-context";
import LoginScreen from "@/screens/login-screen";
import UsersScreen from "@/screens/users-screen";

export default function HomeScreen() {
  const { token, sessionReady } = useAppContext();

  if (!sessionReady) {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#0b1020",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#60a5fa" size="large" />
        <Text style={{ color: "#fff", marginTop: 12 }}>Cargando sesión...</Text>
      </View>
    );
  }

  return token ? <UsersScreen /> : <LoginScreen />;
}
