import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  /* Círculos ambientales de fondo (Mismo estilo que el login) */
  backgroundCircleOne: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#0057FF",
    top: -190,
    right: -130,
    opacity: 0.15,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7C3AED",
    bottom: -170,
    left: -140,
    opacity: 0.13,
  },

  backgroundCircleThree: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#00E5FF",
    top: "43%",
    right: -140,
    opacity: 0.055,
  },

  /* Destellos de energía horizontales partiendo del centro */
  energyWaveLeft: {
    position: "absolute",
    width: "45%",
    height: 2,
    backgroundColor: "#00E5FF",
    left: 0,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 6,
  },

  energyWaveRight: {
    position: "absolute",
    width: "45%",
    height: 2,
    backgroundColor: "#00E5FF",
    right: 0,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 6,
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoGlow: {
    padding: 4,
    borderRadius: 24,
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 18,
  },

  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#081426",
    borderWidth: 1,
    borderColor: "#00BFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 11,
    fontWeight: "900",
    color: "#00CFFF",
    letterSpacing: 3,
  },

  title: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },

  loaderIndicator: {
    marginTop: 24,
  },
});
