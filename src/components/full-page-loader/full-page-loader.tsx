import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, Text, View } from "react-native";

import { styles } from "./full-page-loader.styles";

export function FullPageLoader() {
  const pulse = useRef(new Animated.Value(1)).current;
  const energySpread = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const spreadAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(energySpread, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(energySpread, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnim.start();
    spreadAnim.start();

    return () => {
      pulseAnim.stop();
      spreadAnim.stop();
    };
  }, [pulse, energySpread]);

  return (
    <View style={styles.container}>
      {/* Círculos de fondo ambientales idénticos al Login */}
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />
      <View style={styles.backgroundCircleThree} />

      {/* Ondas de energía partiendo del centro hacia los lados */}
      <Animated.View
        style={[
          styles.energyWaveLeft,
          {
            transform: [{ scaleX: energySpread }],
            opacity: energySpread,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.energyWaveRight,
          {
            transform: [{ scaleX: energySpread }],
            opacity: energySpread,
          },
        ]}
      />

      <View style={styles.contentContainer}>
        {/* Contenedor central con el rayo y efecto Glow */}
        <Animated.View
          style={[
            styles.logoGlow,
            {
              transform: [{ scale: pulse }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="flash" size={34} color="#00E5FF" />
          </View>
        </Animated.View>

        <Text style={styles.title}>Cargando</Text>
        <Text style={styles.subtitle}>Preparando tu sesión...</Text>

        <View style={styles.loaderIndicator}>
          <ActivityIndicator color="#00E5FF" size="small" />
        </View>
      </View>
    </View>
  );
}
