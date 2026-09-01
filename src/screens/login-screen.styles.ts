import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
