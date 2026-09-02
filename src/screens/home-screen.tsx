import * as Location from "expo-location";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { AppShell } from "@/components/app-shell/app-shell";
import { useAppContext } from "@/context/app-context";
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
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [locationInfo, setLocationInfo] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  async function handleGetLocation() {
    try {
      setIsLoadingLocation(true);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setStatusMessage("La ubicación del dispositivo está desactivada.");
        return;
      }

      const permissionResult =
        await Location.requestForegroundPermissionsAsync();
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

      const geoAddress = await Location.reverseGeocodeAsync({
        latitude: nextLocation.latitude,
        longitude: nextLocation.longitude,
      });

      const cityName =
        geoAddress[0]?.city ??
        geoAddress[0]?.subregion ??
        geoAddress[0]?.region ??
        "Ciudad no disponible";

      setLocationInfo(nextLocation);
      setLocationCity(cityName);
      setStatusMessage(
        `Ubicación actual obtenida: ${nextLocation.latitude.toFixed(4)}, ${nextLocation.longitude.toFixed(4)}.`,
      );
    } catch {
      setStatusMessage("La ubicación no está disponible en este momento.");
    } finally {
      setIsLoadingLocation(false);
    }
  }

  const nearbyUsers = locationInfo
    ? [...users]
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
        .filter((user) => user.distanceKm != null)
        .sort((a, b) => {
          if (a.distanceKm == null || b.distanceKm == null) {
            return 0;
          }
          return a.distanceKm - b.distanceKm;
        })
        .slice(0, 5)
    : [];

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
            Obtén la ubicación actual y ordena usuarios por cercanía.
          </Text>

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
              {isLoadingLocation
                ? "Obteniendo ubicación..."
                : "Geolocalización"}
            </Text>
          </Pressable>

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
              <Text
                style={{ color: "#f8fafc", fontSize: 18, fontWeight: "700" }}
              >
                Ubicación actual
              </Text>

              <Text style={{ color: "#f8fafc", marginTop: 8, fontWeight: "600" }}>
                {locationCity ? `Ciudad: ${locationCity}` : "Ciudad: no disponible"}
              </Text>

              <Text style={{ color: "#93c5fd", marginTop: 8 }}>
                {locationInfo.latitude.toFixed(4)},{" "}
                {locationInfo.longitude.toFixed(4)}
              </Text>

              <Text style={{ color: "#cbd5e1", marginTop: 16 }}>
                Usuarios cercanos:
              </Text>

              {nearbyUsers.length === 0 ? (
                <Text style={{ color: "#94a3b8", marginTop: 10 }}>
                  No hay usuarios con ubicación disponible.
                </Text>
              ) : null}

              {nearbyUsers.map((user) => (
                <View
                  key={user.email}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "#e2e8f0" }}>{user.name}</Text>
                  <Text style={{ color: "#93c5fd" }}>
                    {user.distanceKm != null
                      ? `${user.distanceKm.toFixed(1)} km`
                      : "Sin ubicación"}
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
