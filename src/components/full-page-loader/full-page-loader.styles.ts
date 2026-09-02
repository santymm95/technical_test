import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0b1020",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  glow: {
    backgroundColor: "rgba(250, 204, 21, 0.18)",
    borderRadius: 200,
    height: 220,
    position: "absolute",
    width: 220,
  },
  loaderRing: {
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderColor: "rgba(250, 204, 21, 0.8)",
    borderRadius: 100,
    borderWidth: 3,
    height: 120,
    justifyContent: "center",
    width: 120,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 8,
  },
  title: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 28,
  },
});
