import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type CardProps = {
  icon: string;
  title: string;
  description: string;
};

export function Card({ icon, title, description }: CardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 125,
    padding: 15,
    borderRadius: 18,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.65,
  },
});
