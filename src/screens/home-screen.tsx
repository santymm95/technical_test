import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AppShell } from "@/components/app-shell/app-shell";
import { useAppContext, type UserRecord } from "@/context/app-context";
import UsersScreen from "@/screens/users-screen";

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

export default function HomeScreen() {
  const { users } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "inicio" | "usuarios" | "funciones"
  >("inicio");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [locationInfo, setLocationInfo] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!users.length) {
      return;
    }

    if (!selectedUserEmail || !users.some((user) => user.email === selectedUserEmail)) {
      setSelectedUserEmail(users[0].email);
    }
  }, [users, selectedUserEmail]);

  const selectedUser =
    users.find((user) => user.email === selectedUserEmail) ?? users[0] ?? null;

  const nearbyUsers = useMemo(() => {
    if (!locationInfo) {
      return [] as Array<UserRecord & { distanceKm: number | null }>;
    }

    return [...users]
      .map((user) => {
        if (user.latitude == null || user.longitude == null) {
          return { ...user, distanceKm: null };
        }

        return {
          ...user,
          distanceKm: haversineKm(
            locationInfo.latitude,
            locationInfo.longitude,
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
  }, [locationInfo, users]);

  async function handleImageAction(source: "camera" | "library") {
    if (!selectedUser) {
      setStatusMessage("Selecciona un usuario antes de asociar una foto.");
      return;
    }

    const permissionResult =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      const detail =
        source === "camera"
          ? "Se rechazó el acceso a la cámara. Puedes habilitarlo desde Ajustes."
          : "Se rechazó el acceso a la galería. Puedes habilitarlo desde Ajustes.";
      setStatusMessage(detail);
      Alert.alert(
        "Permiso requerido",
        detail,
      );
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
            mediaTypes: ["images"],
          });

    if (result.canceled || !result.assets?.[0]?.uri) {
      setStatusMessage("No se eligió ninguna imagen.");
      return;
    }

    setProfileImages((current) => ({
      ...current,
      [selectedUser.email]: result.assets[0].uri,
    }));
    setStatusMessage(
      `Foto asociada a ${selectedUser.name} correctamente.`,
    );
  }

  async function handleGetLocation() {
    try {
      setIsLoadingLocation(true);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setStatusMessage("La ubicación del dispositivo está desactivada.");
        return;
      }

      const permissionResult = await Location.requestForegroundPermissionsAsync();
      if (permissionResult.status !== "granted") {
        const message =
          "Se denegó el permiso de ubicación. Puedes habilitarlo desde Ajustes.";
        setStatusMessage(message);
        Alert.alert("Permiso requerido", message);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocationInfo(nextLocation);
      setStatusMessage(
        `Ubicación actual obtenida: ${nextLocation.latitude.toFixed(4)}, ${nextLocation.longitude.toFixed(4)}.`,
      );
    } catch {
      setStatusMessage("La ubicación no está disponible en este momento.");
    } finally {
      setIsLoadingLocation(false);
    }
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "inicio" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#f8fafc", fontSize: 24, fontWeight: "700" }}>
            Inicio
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: 8 }}>
            Aquí va el contenido principal
          </Text>
        </View>
      ) : null}

      {activeTab === "usuarios" ? <UsersScreen /> : null}

      {activeTab === "funciones" ? (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          style={{ flex: 1, backgroundColor: "#0b1020" }}
        >
          <Text style={{ color: "#f8fafc", fontSize: 28, fontWeight: "800" }}>
            Funciones
          </Text>

          <Text
            style={{
              color: "#94a3b8",
              fontSize: 14,
              marginTop: 8,
              marginBottom: 20,
            }}
          >
            Captura fotos o usa la ubicación y ordena usuarios por cercanía.
          </Text>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => handleImageAction("camera")}
              style={{
                alignItems: "center",
                backgroundColor: "#2563eb",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Cámara
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleImageAction("library")}
              style={{
                alignItems: "center",
                backgroundColor: "#1f2937",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Galería
              </Text>
            </Pressable>

            <Pressable
              onPress={handleGetLocation}
              disabled={isLoadingLocation}
              style={{
                alignItems: "center",
                backgroundColor: isLoadingLocation ? "#374151" : "#16a34a",
                borderRadius: 12,
                opacity: isLoadingLocation ? 0.7 : 1,
                padding: 14,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {isLoadingLocation ? "Obteniendo ubicación..." : "Geolocalización"}
              </Text>
            </Pressable>
          </View>

          {selectedUser ? (
            <View
              style={{
                backgroundColor: "#111827",
                borderColor: "#1f2937",
                borderRadius: 16,
                borderWidth: 1,
                marginTop: 22,
                padding: 14,
              }}
            >
              <Text style={{ color: "#cbd5e1", marginBottom: 12, fontWeight: "600" }}>
                Usuario seleccionado
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri:
                      profileImages[selectedUser.email] ?? selectedUser.picture,
                  }}
                  style={{
                    backgroundColor: "#1f2937",
                    borderRadius: 28,
                    height: 56,
                    width: 56,
                  }}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                    {selectedUser.name}
                  </Text>
                  <Text style={{ color: "#93c5fd" }}>{selectedUser.email}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {users.slice(0, 4).map((user) => (
                  <Pressable
                    key={user.email}
                    onPress={() => setSelectedUserEmail(user.email)}
                    style={{
                      backgroundColor:
                        selectedUser.email === user.email ? "#2563eb" : "#1f2937",
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      {user.name.split(" ")[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {statusMessage ? (
            <Text
              style={{
                color: "#bfdbfe",
                marginTop: 20,
                lineHeight: 20,
              }}
            >
              {statusMessage}
            </Text>
          ) : null}

          {locationInfo ? (
            <View
              style={{
                backgroundColor: "#111827",
                borderColor: "#1f2937",
                borderRadius: 16,
                borderWidth: 1,
                marginTop: 20,
                padding: 14,
              }}
            >
              <Text style={{ color: "#f8fafc", fontSize: 18, fontWeight: "700" }}>
                Usuarios por cercanía
              </Text>

              {nearbyUsers.slice(0, 5).map((user) => (
                <View
                  key={user.email}
                  style={{
                    borderTopColor: "#1f2937",
                    borderTopWidth: user.email === nearbyUsers[0]?.email ? 0 : 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: user.email === nearbyUsers[0]?.email ? 0 : 10,
                    marginTop: user.email === nearbyUsers[0]?.email ? 10 : 10,
                  }}
                >
                  <Text style={{ color: "#e2e8f0" }}>{user.name}</Text>
                  <Text style={{ color: "#93c5fd" }}>
                    {user.distanceKm != null ? `${user.distanceKm.toFixed(1)} km` : "Sin ubicación"}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </AppShell>
  );
}
