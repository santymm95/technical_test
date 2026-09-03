import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppContext } from "@/context/app-context";
import { styles } from "./login-screen.styles";

export default function LoginScreen() {
  const { loginWithEmailPassword, loginLoading, errorMessage, clearError } =
    useAppContext();

  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    clearError();

    try {
      await loginWithEmailPassword(email, password);
    } catch (error) {
      Alert.alert(
        "ERROR DE AUTENTICACIÓN",
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.",
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />
      <View style={styles.backgroundCircleThree} />

      <View style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.logoGlow}>
            <View style={styles.logoContainer}>
              <Ionicons name="flash" size={30} color="#00E5FF" />
            </View>
          </View>

          <Text style={styles.brand}>APP MÓVIL</Text>

          <Text style={styles.title}>Bienvenido</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardLine} />

          <Text style={styles.formTitle}>INICIAR SESIÓN</Text>

          <Text style={styles.formDescription}>
            Ingresa tus credenciales para continuar
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#00CFFF"
                style={styles.inputIcon}
              />

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                onFocus={clearError}
                placeholder="correo@empresa.com"
                placeholderTextColor="#526174"
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#00CFFF"
                style={styles.inputIcon}
              />

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setPassword}
                onFocus={clearError}
                placeholder="••••••••"
                placeholderTextColor="#526174"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
              />

              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={21}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={18} color="#FF4D67" />

              <Text style={styles.error}>{errorMessage}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={loginLoading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loginLoading && styles.buttonDisabled,
            ]}
          >
            {loginLoading ? (
              <>
                <ActivityIndicator color="#001018" size="small" />

                <Text style={styles.buttonText}>AUTENTICANDO...</Text>
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>INGRESAR</Text>

                <Ionicons name="arrow-forward" size={20} color="#001018" />
              </>
            )}
          </Pressable>

          <View style={styles.securityContainer}>
            <View style={styles.statusDot} />

            <Text style={styles.securityText}>SISTEMA PROTEGIDO</Text>

            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color="#00D9FF"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Prueba Móvil</Text>

          <View style={styles.footerLine} />

          <Text style={styles.footerVersion}>v1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
