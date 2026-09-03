import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
  },
  compactClock: {
    transform: [{ scale: 0.68 }],
    marginVertical: -34,
  },
  clock: {
    backgroundColor: "#07111F",
    borderColor: "#00D9FF",
    borderRadius: 110,
    borderWidth: 2,
    height: 220,
    position: "relative",
    shadowColor: "#00E5FF",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
    width: 220,
  },
  marker: {
    backgroundColor: "#00CFFF",
    borderRadius: 3,
    height: 6,
    position: "absolute",
    width: 6,
  },
  number: {
    color: "#E6F7FF",
    fontSize: 16,
    fontWeight: "800",
    left: 101,
    position: "absolute",
    top: 12,
  },
  numberThree: {
    left: 193,
    top: 101,
  },
  numberSix: {
    left: 104,
    top: 190,
  },
  numberNine: {
    left: 16,
    top: 101,
  },
  hands: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  hand: {
    alignItems: "center",
    backgroundColor: "transparent",
    left: "50%",
    position: "absolute",
    top: "50%",
    transformOrigin: "center bottom",
  },
  handCap: {
    borderRadius: 4,
    flex: 1,
    width: "100%",
  },
  centerDot: {
    backgroundColor: "#00D9FF",
    borderColor: "#E6F7FF",
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    left: 104,
    position: "absolute",
    top: 104,
    width: 12,
  },
  dateLabel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
    textTransform: "capitalize",
  },
});
