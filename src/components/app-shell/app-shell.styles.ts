import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderBottomColor: "#1f2937",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerLabel: {
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  userName: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#1f2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderTopColor: "#1f2937",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: "#1d4ed8",
    borderRadius: 14,
    marginHorizontal: 8,
  },
  tabLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#ffffff",
  },
});
