import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#091222",
    borderBottomColor: "#162B46",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerLabel: {
    color: "#00CFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  userName: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#081426",
    borderColor: "#1A304A",
    borderWidth: 1,
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
    backgroundColor: "#050816",
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: "#091222",
    borderTopColor: "#162B46",
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
    backgroundColor: "#00D9FF",
    borderRadius: 13,
    marginHorizontal: 8,
  },
  tabLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#001018",
  },
});
