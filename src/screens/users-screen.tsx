import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppContext, type UserRecord } from "@/context/app-context";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function UsersScreen() {
  const { users, fetchUsers, offline, errorMessage, logOut, userEmail } =
    useAppContext();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    async function getCurrentLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...users]
      .filter((user) => {
        if (!query) {
          return true;
        }

        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
      .map((user) => {
        if (!location || user.latitude == null || user.longitude == null) {
          return { ...user, distanceKm: null };
        }

        return {
          ...user,
          distanceKm: haversineKm(
            location.latitude,
            location.longitude,
            user.latitude,
            user.longitude,
          ),
        };
      })
      .sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) {
          return a.name.localeCompare(b.name);
        }

        if (a.distanceKm == null) {
          return 1;
        }

        if (b.distanceKm == null) {
          return -1;
        }

        return a.distanceKm - b.distanceKm;
      });
  }, [users, search, location]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchUsers(true);
    setRefreshing(false);
  }

  function renderItem({ item }: { item: UserRecord }) {
    return (
      <View style={styles.card}>
        {item.picture ? (
          <Image source={{ uri: item.picture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.userMeta}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
          <Text style={styles.location}>
            {item.city}, {item.state}
            {item.distanceKm != null
              ? ` • ${item.distanceKm.toFixed(1)} km`
              : ""}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Usuarios</Text>
          <Pressable onPress={() => logOut()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        </View>

        <Text style={styles.userLabel}>Cuenta: {userEmail}</Text>

        {offline ? (
          <View style={styles.cacheBanner}>
            <Text style={styles.cacheText}>Mostrando datos guardados</Text>
          </View>
        ) : null}

        <TextInput
          onChangeText={setSearch}
          placeholder="Buscar por nombre o email"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={search}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {users.length === 0 && !offline ? (
          <ActivityIndicator
            color="#60a5fa"
            size="large"
            style={styles.loader}
          />
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
