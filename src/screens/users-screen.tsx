import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppContext, type UserRecord } from "@/context/app-context";
import { styles } from "./users-screen.styles";

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
      try {
        // Check if location services are enabled
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          console.warn("Location services are disabled");
          return;
        }

        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          console.warn("Location permission denied");
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (error) {
        console.warn("Failed to get current location:", error);
        // Continue app functionality without location
      }
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
