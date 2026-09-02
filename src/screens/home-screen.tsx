import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    GestureResponderEvent,
    PanResponder,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";

import { AppShell } from "@/components/app-shell/app-shell";
import { useAppContext } from "@/context/app-context";
import UsersScreen from "@/screens/users-screen";

const WIDGET_STORAGE_KEY = "appmovil.widgets.positions";

type WidgetPosition = {
  id: string;
  x: number;
  y: number;
  order: number;
};

type WeatherData = {
  temperature: number;
  weatherCode: number;
  description: string;
  windSpeed: number;
  humidity: number;
  city: string;
  country: string;
};

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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [widgetPositions, setWidgetPositions] = useState<WidgetPosition[]>([
    { id: "weather", x: 0, y: 0, order: 0 },
    { id: "calendar", x: 0, y: 0, order: 1 },
  ]);
  const [draggingWidget, setDraggingWidget] = useState<string | null>(null);
  const [draggedOverWidget, setDraggedOverWidget] = useState<string | null>(
    null,
  );

  // Weather pan responder
  const weatherPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggingWidget("weather");
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState) => {
        const { moveY } = gestureState;
        // Check if widget is over another widget for swap
        if (moveY > 400 && moveY < 600) {
          setDraggedOverWidget("calendar");
        } else {
          setDraggedOverWidget(null);
        }
      },
      onPanResponderRelease: () => {
        if (draggingWidget && draggedOverWidget) {
          // Swap widgets order
          setWidgetPositions((current) => {
            const draggingIdx = current.findIndex(
              (w) => w.id === draggingWidget,
            );
            const draggedIdx = current.findIndex(
              (w) => w.id === draggedOverWidget,
            );
            if (draggingIdx !== -1 && draggedIdx !== -1) {
              const newPositions = [...current];
              [
                newPositions[draggingIdx].order,
                newPositions[draggedIdx].order,
              ] = [
                newPositions[draggedIdx].order,
                newPositions[draggingIdx].order,
              ];
              return newPositions;
            }
            return current;
          });
          persistWidgetPositions();
        }
        setDraggingWidget(null);
        setDraggedOverWidget(null);
      },
    }),
  ).current;

  // Calendar pan responder
  const calendarPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggingWidget("calendar");
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState) => {
        const { moveY } = gestureState;
        // Check if widget is over another widget for swap
        if (moveY < 200) {
          setDraggedOverWidget("weather");
        } else {
          setDraggedOverWidget(null);
        }
      },
      onPanResponderRelease: () => {
        if (draggingWidget && draggedOverWidget) {
          // Swap widgets order
          setWidgetPositions((current) => {
            const draggingIdx = current.findIndex(
              (w) => w.id === draggingWidget,
            );
            const draggedIdx = current.findIndex(
              (w) => w.id === draggedOverWidget,
            );
            if (draggingIdx !== -1 && draggedIdx !== -1) {
              const newPositions = [...current];
              [
                newPositions[draggingIdx].order,
                newPositions[draggedIdx].order,
              ] = [
                newPositions[draggedIdx].order,
                newPositions[draggingIdx].order,
              ];
              return newPositions;
            }
            return current;
          });
          persistWidgetPositions();
        }
        setDraggingWidget(null);
        setDraggedOverWidget(null);
      },
    }),
  ).current;

  useEffect(() => {
    loadWidgetPositions();
    handleGetWeather();
  }, []);

  async function loadWidgetPositions() {
    try {
      const stored = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
      if (stored) {
        setWidgetPositions(JSON.parse(stored));
      }
    } catch {
      // Keep default positions
    }
  }

  async function persistWidgetPositions() {
    try {
      await AsyncStorage.setItem(
        WIDGET_STORAGE_KEY,
        JSON.stringify(widgetPositions),
      );
    } catch {
      // Silently fail
    }
  }

  function getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }

  function renderCalendarDays() {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const CELL_SIZE = 50;
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View
          key={`empty-${i}`}
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
        />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      days.push(
        <View
          key={day}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: today ? "#2563eb" : "transparent",
            borderRadius: today ? 8 : 0,
            marginBottom: 4,
            marginRight: 4,
          }}
        >
          <Text
            style={{
              color: today ? "#fff" : "#cbd5e1",
              fontSize: 14,
              fontWeight: today ? "700" : "500",
            }}
          >
            {day}
          </Text>
        </View>,
      );
    }

    return days;
  }

  function getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      0: "Despejado",
      1: "Parcialmente nublado",
      2: "Nublado",
      3: "Muy nublado",
      45: "Niebla",
      48: "Niebla con escarcha",
      51: "Llovizna ligera",
      53: "Llovizna moderada",
      55: "Llovizna densa",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      65: "Lluvia fuerte",
      71: "Nieve ligera",
      73: "Nieve moderada",
      75: "Nieve fuerte",
      77: "Granizo",
      80: "Aguaceros ligeros",
      81: "Aguaceros moderados",
      82: "Aguaceros violentos",
      85: "Nieve en aguaceros ligeros",
      86: "Nieve en aguaceros moderados",
      95: "Tormenta",
      96: "Tormenta con granizo ligero",
      99: "Tormenta con granizo fuerte",
    };

    return descriptions[code] ?? "Desconocido";
  }

  async function handleGetWeather() {
    try {
      setIsLoadingWeather(true);
      setWeatherError(null);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setWeatherError("La ubicación del dispositivo está desactivada.");
        return;
      }

      const permissionResult =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResult.status !== "granted") {
        setWeatherError("Permiso de ubicación denegado.");
        Alert.alert(
          "Permiso requerido",
          "Se requiere acceso a la ubicación para mostrar el clima.",
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      const geoAddress = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const cityName =
        geoAddress[0]?.city ??
        geoAddress[0]?.subregion ??
        geoAddress[0]?.region ??
        "Ubicación desconocida";
      const countryName = geoAddress[0]?.country ?? "";

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`,
      );

      if (!weatherResponse.ok) {
        throw new Error("No se pudo obtener los datos del clima.");
      }

      const weatherJson = await weatherResponse.json();
      const current = weatherJson.current;

      setWeather({
        temperature: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        description: getWeatherDescription(current.weather_code),
        windSpeed: Math.round(current.wind_speed_10m),
        humidity: current.relative_humidity_2m,
        city: cityName,
        country: countryName,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al obtener el clima";
      setWeatherError(message);
    } finally {
      setIsLoadingWeather(false);
    }
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "inicio" ? (
        <View style={{ flex: 1, backgroundColor: "#0b1020", padding: 20 }}>
          <Text
            style={{
              color: "#f8fafc",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 20,
            }}
          >
            Dashboard
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Widgets sorted by order */}
            {[...widgetPositions]
              .sort((a, b) => a.order - b.order)
              .map((widget) => {
                if (widget.id === "weather") {
                  return (
                    <View
                      key="weather"
                      {...weatherPanResponder.panHandlers}
                      style={{
                        backgroundColor:
                          draggingWidget === "weather"
                            ? "#1a2332"
                            : draggedOverWidget === "weather"
                              ? "#0d1620"
                              : "#111827",
                        borderColor:
                          draggedOverWidget === "weather"
                            ? "#2563eb"
                            : "#1f2937",
                        borderRadius: 16,
                        borderWidth: 2,
                        padding: 16,
                        marginBottom: 16,
                        opacity: draggingWidget === "weather" ? 0.7 : 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f8fafc",
                            fontSize: 18,
                            fontWeight: "700",
                          }}
                        >
                          Clima
                        </Text>
                        <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                          ⋮⋮ Arrastra
                        </Text>
                      </View>

                      <Pressable
                        onPress={handleGetWeather}
                        disabled={isLoadingWeather}
                        style={{
                          alignItems: "center",
                          backgroundColor: isLoadingWeather
                            ? "#374151"
                            : "#2563eb",
                          borderRadius: 8,
                          marginBottom: 12,
                          opacity: isLoadingWeather ? 0.7 : 1,
                          padding: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {isLoadingWeather ? "Cargando..." : "Actualizar"}
                        </Text>
                      </Pressable>

                      {weatherError ? (
                        <Text style={{ color: "#fca5a5", fontSize: 14 }}>
                          {weatherError}
                        </Text>
                      ) : null}

                      {weather ? (
                        <>
                          <Text
                            style={{
                              color: "#cbd5e1",
                              fontSize: 14,
                              marginBottom: 8,
                            }}
                          >
                            {weather.city}, {weather.country}
                          </Text>
                          <Text
                            style={{
                              color: "#93c5fd",
                              fontSize: 36,
                              fontWeight: "700",
                              marginBottom: 8,
                            }}
                          >
                            {weather.temperature}°
                          </Text>
                          <Text
                            style={{
                              color: "#e2e8f0",
                              fontSize: 14,
                              marginBottom: 12,
                            }}
                          >
                            {weather.description}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                              💧 {weather.humidity}%
                            </Text>
                            <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                              💨 {weather.windSpeed} km/h
                            </Text>
                          </View>
                        </>
                      ) : null}
                    </View>
                  );
                } else if (widget.id === "calendar") {
                  return (
                    <View
                      key="calendar"
                      {...calendarPanResponder.panHandlers}
                      style={{
                        backgroundColor:
                          draggingWidget === "calendar"
                            ? "#1a2332"
                            : draggedOverWidget === "calendar"
                              ? "#0d1620"
                              : "#111827",
                        borderColor:
                          draggedOverWidget === "calendar"
                            ? "#2563eb"
                            : "#1f2937",
                        borderRadius: 16,
                        borderWidth: 2,
                        padding: 16,
                        marginBottom: 16,
                        opacity: draggingWidget === "calendar" ? 0.7 : 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f8fafc",
                            fontSize: 18,
                            fontWeight: "700",
                          }}
                        >
                          Calendario
                        </Text>
                        <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                          ⋮⋮ Arrastra
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        <Pressable
                          onPress={() =>
                            setSelectedDate(
                              new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth() - 1,
                              ),
                            )
                          }
                          style={{ padding: 8 }}
                        >
                          <Text
                            style={{
                              color: "#2563eb",
                              fontWeight: "600",
                              fontSize: 18,
                            }}
                          >
                            ←
                          </Text>
                        </Pressable>
                        <Text
                          style={{
                            color: "#cbd5e1",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {selectedDate.toLocaleString("es-ES", {
                            month: "long",
                            year: "numeric",
                          })}
                        </Text>
                        <Pressable
                          onPress={() =>
                            setSelectedDate(
                              new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth() + 1,
                              ),
                            )
                          }
                          style={{ padding: 8 }}
                        >
                          <Text
                            style={{
                              color: "#2563eb",
                              fontWeight: "600",
                              fontSize: 18,
                            }}
                          >
                            →
                          </Text>
                        </Pressable>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 12,
                          borderBottomColor: "#1f2937",
                          borderBottomWidth: 1,
                          paddingBottom: 8,
                          justifyContent: "space-around",
                        }}
                      >
                        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                          (day) => (
                            <Text
                              key={day}
                              style={{
                                color: "#94a3b8",
                                fontSize: 11,
                                fontWeight: "600",
                                width: 50,
                                textAlign: "center",
                              }}
                            >
                              {day}
                            </Text>
                          ),
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-around",
                        }}
                      >
                        {renderCalendarDays()}
                      </View>
                    </View>
                  );
                }
                return null;
              })}
          </ScrollView>
        </View>
      ) : null}

      {activeTab === "usuarios" ? <UsersScreen /> : null}

      {activeTab === "funciones" ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0b1020",
          }}
        >
          <Text style={{ color: "#f8fafc", fontSize: 24, fontWeight: "700" }}>
            Funciones
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: 8 }}>
            Más funcionalidades próximamente
          </Text>
        </View>
      ) : null}
    </AppShell>
  );
}
