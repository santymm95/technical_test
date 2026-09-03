import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
  },

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

  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoGlow: {
    padding: 3,
    borderRadius: 21,
    backgroundColor: "rgba(0, 229, 255, 0.08)",
    shadowColor: "#00E5FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 10,
  },

  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#081426",
    borderWidth: 1,
    borderColor: "#00BFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    marginTop: 18,
    fontSize: 11,
    fontWeight: "900",
    color: "#00CFFF",
    letterSpacing: 3,
  },

  title: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#091222",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#162B46",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.55,
    shadowRadius: 35,
    elevation: 12,
  },

  cardLine: {
    position: "absolute",
    top: 0,
    left: 35,
    right: 35,
    height: 2,
    backgroundColor: "#00D9FF",
    borderRadius: 2,
    shadowColor: "#00E5FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },

  formTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: 1.2,
  },

  formDescription: {
    marginTop: 6,
    marginBottom: 25,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "800",
    color: "#718096",
    letterSpacing: 1.1,
  },

  inputContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07111F",
    borderWidth: 1,
    borderColor: "#1A304A",
    borderRadius: 13,
    paddingLeft: 14,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    paddingRight: 12,
    fontSize: 14,
    color: "#E6F7FF",
  },

  eyeButton: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 45, 85, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 103, 0.35)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  error: {
    flex: 1,
    marginLeft: 8,
    color: "#FF7187",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  button: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#00D9FF",
    borderRadius: 13,
    marginTop: 4,
    shadowColor: "#00D9FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 8,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: "#001018",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00E5FF",
    marginRight: 7,
    shadowColor: "#00E5FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 4,
  },

  securityText: {
    marginRight: 7,
    fontSize: 9,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1.2,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#334155",
    letterSpacing: 1.5,
  },

  footerLine: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#00CFFF",
    marginHorizontal: 9,
    shadowColor: "#00E5FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  footerVersion: {
    fontSize: 9,
    color: "#334155",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
