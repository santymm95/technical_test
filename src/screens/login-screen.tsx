import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAppContext } from "@/context/app-context";
import { styles } from "./login-screen.styles";

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
