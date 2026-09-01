import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppContext } from "@/context/app-context";

export default function LoginScreen() {
  const { loginWithEmailPassword, loginLoading, errorMessage, clearError } =
    useAppContext();
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");

  async function handleLogin() {
    clearError();

    try {
      await loginWithEmailPassword(email, password);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Falló el login",
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>ACEMA</Text>
        <Text style={styles.subtitle}>Inicio de sesión</Text>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
        />

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          disabled={loginLoading}
          onPress={handleLogin}
          style={styles.button}
        >
          {loginLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </Pressable>

        <Text style={styles.helper}>Demo: eve.holt@reqres.in / cityslicka</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    color: "#c5d0eb",
    fontSize: 18,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#111827",
    borderColor: "#2b3a50",
    borderRadius: 12,
    borderWidth: 1,
    color: "#fff",
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#fca5a5",
    marginBottom: 12,
  },
  helper: {
    color: "#9ca3af",
    marginTop: 18,
    textAlign: "center",
  },
});
