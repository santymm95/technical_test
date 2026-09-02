import { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    Text,
    View,
} from "react-native";

import { styles } from "./full-page-loader.styles";

export function FullPageLoader() {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinAnim = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    spinAnim.start();
    pulseAnim.start();

    return () => {
      spinAnim.stop();
      pulseAnim.stop();
    };
  }, [pulse, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <Animated.View
        style={[
          styles.loaderRing,
          {
            transform: [{ rotate }, { scale: pulse }],
          },
        ]}
      >
        <ActivityIndicator color="#FACC15" size="large" />
      </Animated.View>

      <Text style={styles.title}>Cargando</Text>
      <Text style={styles.subtitle}>Preparando tu sesión...</Text>
    </View>
  );
}
