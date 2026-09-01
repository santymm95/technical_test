import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  logoutButton: {
    backgroundColor: "#1f2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  userLabel: {
    color: "#cbd5e1",
    marginBottom: 12,
  },
  cacheBanner: {
    backgroundColor: "#0f766e",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  cacheText: {
    color: "#ecfeff",
    fontWeight: "700",
  },
  searchInput: {
    backgroundColor: "#111827",
    borderColor: "#2b3a50",
    borderRadius: 12,
    borderWidth: 1,
    color: "#fff",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: "#fca5a5",
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    borderColor: "#1f2937",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
  },
  avatar: {
    backgroundColor: "#1f2937",
    borderRadius: 26,
    height: 52,
    width: 52,
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  avatarPlaceholderText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  userMeta: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  email: {
    color: "#bfdbfe",
    marginTop: 4,
  },
  phone: {
    color: "#cbd5e1",
    marginTop: 2,
  },
  location: {
    color: "#93c5fd",
    marginTop: 6,
  },
  loader: {
    marginTop: 40,
  },
});
