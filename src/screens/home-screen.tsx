import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { AnalogClock } from "@/components/analog-clock/analog-clock";
import { AppShell } from "@/components/app-shell/app-shell";
import { useAppContext } from "@/context/app-context";
import UsersScreen from "@/screens/users-screen";

const WIDGET_STORAGE_KEY = "appmovil.widgets.positions";
const AGENDA_STORAGE_KEY = "appmovil.agenda.events";

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

type DeviceLocation = {
  latitude: number;
  longitude: number;
};

type AgendaEvents = Record<string, string[]>;

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(
    null,
  );
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationCountry, setLocationCountry] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState(
    "Pulsa el botón para buscar usuarios cercanos.",
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvents>({});
  const [agendaTitle, setAgendaTitle] = useState("");
  const [isAgendaModalVisible, setIsAgendaModalVisible] = useState(false);
  const [widgetPositions, setWidgetPositions] = useState<WidgetPosition[]>([
    { id: "weather", x: 0, y: 0, order: 0 },
    { id: "calendar", x: 0, y: 0, order: 1 },
  ]);
  useEffect(() => {
    loadWidgetPositions();
    loadAgendaEvents();
  }, []);

  async function loadAgendaEvents() {
    try {
      const stored = await AsyncStorage.getItem(AGENDA_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AgendaEvents;
        setAgendaEvents(parsed ?? {});
      }
    } catch {
      setAgendaEvents({});
    }
  }

  async function saveAgendaEvent() {
    const title = agendaTitle.trim();
    if (!title) {
      return;
    }

    const dateKey = getDateKey(selectedDate);
    const nextEvents = {
      ...agendaEvents,
      [dateKey]: [...(agendaEvents[dateKey] ?? []), title],
    };

    setAgendaEvents(nextEvents);
    setAgendaTitle("");
    await AsyncStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(nextEvents));
    setIsAgendaModalVisible(false);
  }

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

  function isSelectedDay(day: number): boolean {
    return (
      day === selectedDate.getDate() &&
      selectedDate.getMonth() === selectedDate.getMonth() &&
      selectedDate.getFullYear() === selectedDate.getFullYear()
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
      const selected = isSelectedDay(day);
      const dayEvents =
        agendaEvents[
          getDateKey(
            new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
          )
        ];
      days.push(
        <Pressable
          key={day}
          onPress={() =>
            (() => {
              setSelectedDate(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  day,
                ),
              );
              setAgendaTitle("");
              setIsAgendaModalVisible(true);
            })()
          }
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected ? "#00D9FF" : "transparent",
            borderColor: today && !selected ? "#00D9FF" : "transparent",
            borderRadius: 8,
            borderWidth: today && !selected ? 1 : 0,
            marginBottom: 4,
            marginRight: 4,
          }}
        >
          <Text
            style={{
              color: selected ? "#001018" : "#CBD5E1",
              fontSize: 14,
              fontWeight: selected || today ? "700" : "500",
            }}
          >
            {day}
          </Text>
          {dayEvents?.length ? (
            <View
              style={{
                backgroundColor: selected ? "#001018" : "#00D9FF",
                borderRadius: 3,
                bottom: 4,
                height: 5,
                position: "absolute",
                width: 5,
              }}
            />
          ) : null}
        </Pressable>,
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
      setDeviceLocation({ latitude, longitude });

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

  async function handleGetLocation(): Promise<boolean> {
    try {
      setIsLoadingLocation(true);
      setLocationMessage("Obteniendo ubicación actual...");

      if (!(await Location.hasServicesEnabledAsync())) {
        setDeviceLocation(null);
        setLocationCity(null);
        setLocationCountry(null);
        setLocationMessage(
          "La ubicación del dispositivo está desactivada. Actívala en Ajustes y vuelve a intentarlo.",
        );
        Alert.alert(
          "Activa la ubicación",
          "Activa manualmente la ubicación del dispositivo para poder mostrar tu ciudad y país.",
        );
        return false;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setDeviceLocation(null);
        setLocationCity(null);
        setLocationCountry(null);
        setLocationMessage(
          "Permiso de ubicación denegado. Puedes habilitarlo en Ajustes para ordenar los usuarios por cercanía.",
        );
        Alert.alert(
          "Permiso de ubicación denegado",
          "Permite el acceso a la ubicación cuando quieras mostrar tu ciudad y país.",
        );
        return false;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextLocation = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };

      setDeviceLocation(nextLocation);

      let city = "Ciudad desconocida";
      let country = "País desconocido";

      try {
        const address = await Location.reverseGeocodeAsync(nextLocation);
        city =
          address[0]?.city ??
          address[0]?.subregion ??
          address[0]?.region ??
          city;
        country = address[0]?.country ?? country;
      } catch {
        // La ubicación sigue siendo válida aunque no haya dirección disponible.
      }

      setLocationCity(city);
      setLocationCountry(country);
      setLocationMessage(
        "Ubicación actualizada. Usuarios ordenados por cercanía.",
      );
      return true;
    } catch {
      setDeviceLocation(null);
      setLocationCity(null);
      setLocationCountry(null);
      setLocationMessage(
        "No se pudo obtener la ubicación. Comprueba la señal del dispositivo y vuelve a intentarlo.",
      );
      return false;
    } finally {
      setIsLoadingLocation(false);
    }
  }

  const nearestUsers = deviceLocation
    ? users
        .filter((user) => user.latitude != null && user.longitude != null)
        .map((user) => ({
          ...user,
          distanceKm: haversineKm(
            deviceLocation.latitude,
            deviceLocation.longitude,
            user.latitude as number,
            user.longitude as number,
          ),
        }))
        .sort(
          (firstUser, secondUser) =>
            firstUser.distanceKm - secondUser.distanceKm,
        )
        .slice(0, 3)
    : [];

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "inicio" ? (
        <View style={{ flex: 1, backgroundColor: "#050816", padding: 20 }}>
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 20,
            }}
          >
            Dashboard
          </Text>

          <ScrollView
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: "#091222",
                borderColor: "#162B46",
                borderRadius: 16,
                borderWidth: 2,
                marginRight: "2%",
                marginBottom: 16,
                padding: 16,
                width: "48%",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Hora actual
                </Text>
                <Text style={{ color: "#64748B", fontSize: 12 }}>
                  TIEMPO LOCAL
                </Text>
              </View>
              <AnalogClock compact />
            </View>

            {/* Widgets sorted by order */}
            {[...widgetPositions]
              .sort((a, b) => {
                if (a.id === "calendar") {
                  return 1;
                }
                if (b.id === "calendar") {
                  return -1;
                }
                return a.order - b.order;
              })
              .map((widget) => {
                if (widget.id === "weather") {
                  return (
                    <View
                      key="weather"
                      style={{
                        backgroundColor: "#091222",
                        borderColor: "#162B46",
                        borderRadius: 16,
                        borderWidth: 2,
                        padding: 16,
                        marginBottom: 16,
                        width: "48%",
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
                            color: "#F8FAFC",
                            fontSize: 18,
                            fontWeight: "700",
                          }}
                        >
                          Clima
                        </Text>
                      </View>

                      <Pressable
                        onPress={handleGetWeather}
                        disabled={isLoadingWeather}
                        style={{
                          alignItems: "center",
                          backgroundColor: isLoadingWeather
                            ? "#1A304A"
                            : "#00D9FF",
                          borderRadius: 8,
                          marginBottom: 12,
                          opacity: isLoadingWeather ? 0.7 : 1,
                          padding: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#001018",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {isLoadingWeather ? "Cargando..." : "Actualizar"}
                        </Text>
                      </Pressable>

                      {weatherError ? (
                        <Text style={{ color: "#FF7187", fontSize: 14 }}>
                          {weatherError}
                        </Text>
                      ) : null}

                      {weather ? (
                        <>
                          <Text
                            style={{
                              color: "#CBD5E1",
                              fontSize: 14,
                              marginBottom: 8,
                            }}
                          >
                            {weather.city}, {weather.country}
                          </Text>
                          <Text
                            style={{
                              color: "#00CFFF",
                              fontSize: 36,
                              fontWeight: "700",
                              marginBottom: 8,
                            }}
                          >
                            {weather.temperature}°
                          </Text>
                          <Text
                            style={{
                              color: "#E6F7FF",
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
                            <Text style={{ color: "#64748B", fontSize: 12 }}>
                              💧 {weather.humidity}%
                            </Text>
                            <Text style={{ color: "#64748B", fontSize: 12 }}>
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
                      style={{
                        backgroundColor: "#091222",
                        borderColor: "#162B46",
                        borderRadius: 16,
                        borderWidth: 2,
                        padding: 16,
                        marginBottom: 16,
                        width: "100%",
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
                            color: "#F8FAFC",
                            fontSize: 18,
                            fontWeight: "700",
                          }}
                        >
                          Calendario
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
                              color: "#00D9FF",
                              fontWeight: "600",
                              fontSize: 18,
                            }}
                          >
                            ←
                          </Text>
                        </Pressable>
                        <Text
                          style={{
                            color: "#CBD5E1",
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
                              color: "#00D9FF",
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
                          borderBottomColor: "#162B46",
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
                                color: "#64748B",
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

                      {(agendaEvents[getDateKey(selectedDate)] ?? []).map(
                        (event, index) => (
                          <Text
                            key={`${event}-${index}`}
                            style={{
                              color: "#CBD5E1",
                              marginTop: 10,
                            }}
                          >
                            • {event}
                          </Text>
                        ),
                      )}
                    </View>
                  );
                }
                return null;
              })}

            <View
              style={{
                backgroundColor: "#091222",
                borderColor: "#162B46",
                borderRadius: 16,
                borderWidth: 2,
                marginBottom: 16,
                padding: 16,
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 12,
                }}
              >
                Primeros usuarios
              </Text>
              <View style={{ flexDirection: "row" }}>
                {nearestUsers.map((user, index) => (
                  <View
                    key={user.id}
                    style={{
                      borderRightColor: index < 2 ? "#162B46" : "transparent",
                      borderRightWidth: index < 2 ? 1 : 0,
                      marginRight: index < 2 ? "2%" : 0,
                      paddingVertical: 10,
                      width: "32%",
                    }}
                  >
                    <Text style={{ color: "#E6F7FF", fontWeight: "700" }}>
                      {user.name}
                    </Text>
                    <Text style={{ color: "#64748B", marginTop: 3 }}>
                      Km: {user.distanceKm.toFixed(1)}
                    </Text>
                  </View>
                ))}
                {!deviceLocation ? (
                  <Text style={{ color: "#64748B" }}>
                    Usa tu ubicación para calcular la cercanía.
                  </Text>
                ) : null}
              </View>
            </View>
          </ScrollView>
          <Modal
            animationType="fade"
            transparent
            visible={isAgendaModalVisible}
            onRequestClose={() => setIsAgendaModalVisible(false)}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "rgba(5, 8, 22, 0.78)",
                flex: 1,
                justifyContent: "center",
                padding: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#091222",
                  borderColor: "#00D9FF",
                  borderRadius: 16,
                  borderWidth: 1,
                  padding: 20,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  Crear evento
                </Text>
                <Text style={{ color: "#00CFFF", marginTop: 6 }}>
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </Text>
                <TextInput
                  autoFocus
                  onChangeText={setAgendaTitle}
                  onSubmitEditing={saveAgendaEvent}
                  placeholder="Nombre del evento"
                  placeholderTextColor="#64748B"
                  style={{
                    backgroundColor: "#07111F",
                    borderColor: "#1A304A",
                    borderRadius: 10,
                    borderWidth: 1,
                    color: "#E6F7FF",
                    marginTop: 18,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                  }}
                  value={agendaTitle}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 16,
                  }}
                >
                  <Pressable
                    onPress={() => setIsAgendaModalVisible(false)}
                    style={{
                      borderColor: "#1A304A",
                      borderRadius: 10,
                      borderWidth: 1,
                      marginRight: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 11,
                    }}
                  >
                    <Text style={{ color: "#CBD5E1", fontWeight: "700" }}>
                      Cancelar
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={saveAgendaEvent}
                    style={{
                      backgroundColor: "#00D9FF",
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 11,
                    }}
                  >
                    <Text style={{ color: "#001018", fontWeight: "800" }}>
                      Guardar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}

      {activeTab === "usuarios" ? <UsersScreen /> : null}

      {activeTab === "funciones" ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#050816",
          }}
        >
          <Text style={{ color: "#F8FAFC", fontSize: 24, fontWeight: "700" }}>
            Funciones
          </Text>
          <View
            style={{
              backgroundColor: "#091222",
              borderColor: "#162B46",
              borderRadius: 22,
              borderWidth: 1,
              margin: 20,
              padding: 20,
              width: "90%",
            }}
          >
            <Text style={{ color: "#F8FAFC", fontSize: 18, fontWeight: "700" }}>
              Usuarios cercanos
            </Text>
            <Text style={{ color: "#64748B", marginTop: 8 }}>
              {locationMessage}
            </Text>
            <Pressable
              disabled={isLoadingLocation}
              onPress={handleGetLocation}
              style={{
                alignItems: "center",
                backgroundColor: isLoadingLocation ? "#1A304A" : "#00D9FF",
                borderRadius: 13,
                marginTop: 16,
                padding: 12,
              }}
            >
              <Text style={{ color: "#001018", fontWeight: "800" }}>
                {isLoadingLocation ? "Buscando..." : "Usar mi ubicación"}
              </Text>
            </Pressable>
            {deviceLocation ? (
              <>
                <Text style={{ color: "#F8FAFC", fontSize: 18, fontWeight: "700", marginTop: 16 }}>
                  {locationCity ?? "Ciudad desconocida"}
                </Text>
                <Text style={{ color: "#94A3B8", marginTop: 4 }}>
                  {locationCountry ?? "País desconocido"}
                </Text>
                <Text style={{ color: "#00CFFF", marginTop: 16 }}>
                  {deviceLocation.latitude.toFixed(4)},{" "}
                  {deviceLocation.longitude.toFixed(4)}
                </Text>
                {users
                  .filter(
                    (user) => user.latitude != null && user.longitude != null,
                  )
                  .map((user) => ({
                    ...user,
                    distanceKm: haversineKm(
                      deviceLocation.latitude,
                      deviceLocation.longitude,
                      user.latitude as number,
                      user.longitude as number,
                    ),
                  }))
                  .sort((a, b) => a.distanceKm - b.distanceKm)
                  .slice(0, 3)
                  .map((user) => (
                    <Text
                      key={user.id}
                      style={{ color: "#CBD5E1", marginTop: 10 }}
                    >
                      {user.name} · {user.distanceKm.toFixed(1)} km
                    </Text>
                  ))}
              </>
            ) : null}
          </View>
        </View>
      ) : null}
    </AppShell>
  );
}
