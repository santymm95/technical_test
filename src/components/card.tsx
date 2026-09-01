import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { styles } from "./card.styles";

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
