import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    RefreshControl,
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

function isPhotoLocked(user: UserRecord) {
  const hashValue = user.email
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return hashValue % 5 === 0;
}

export default function UsersScreen() {
  const {
    users,
    isDarkMode,
    fetchUsers,
    updateUserPicture,
    offline,
    errorMessage,
    userEmail,
    lastUpdated,
    loadingUsers,
  } = useAppContext();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (users.length > 0 || loadingUsers) {
      return;
    }

    fetchUsers();
  }, [users.length, loadingUsers]);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          return;
        }

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
      } catch {
        // Silently fail - app continues without location
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

  async function handleEndReached() {
    if (!offline && !loadingUsers) {
      await fetchUsers(false);
    }
  }

  function handleScroll(event: any) {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 300);
  }

  function scrollToTop() {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }

  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);

  async function handlePhotoChange(source: "camera" | "library") {
    if (!selectedUser) {
      return;
    }

    if (isPhotoLocked(selectedUser)) {
      Alert.alert(
        "Foto no permitida",
        `${selectedUser.name} no ha permitido cambiar su foto de perfil.`,
      );
      return;
    }

    try {
      const permissionResult =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync(false);

      if (!permissionResult.granted) {
        const message =
          source === "camera"
            ? "Se rechazó el permiso de la cámara. La aplicación continúa funcionando. Puedes habilitarlo desde Ajustes."
            : "Se rechazó el acceso a la galería. La aplicación continúa funcionando. Puedes habilitarlo desde Ajustes.";

        Alert.alert("Permiso requerido", message);
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.8,
              mediaTypes: ["images"],
            })
          : await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              quality: 0.8,
              mediaTypes: ["images"],
            });

      if (result.canceled || !result.assets?.[0]?.uri) {
        Alert.alert(
          "Acción cancelada",
          source === "camera"
            ? "No se tomó ninguna foto."
            : "No se seleccionó ninguna imagen.",
        );
        return;
      }

      setPendingPhotoUri(result.assets[0].uri);
      setSelectedUser((current) =>
        current ? { ...current, picture: result.assets[0].uri } : null,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible acceder a la cámara.";

      Alert.alert(
        source === "camera" ? "Error de cámara" : "Error de galería",
        `No se pudo completar la operación. ${message}`,
      );
    }
  }

  async function applyPhotoChanges() {
    if (!selectedUser || !pendingPhotoUri) {
      setSelectedUser(null);
      return;
    }

    try {
      await updateUserPicture(selectedUser.email, pendingPhotoUri);
      setPendingPhotoUri(null);
      setSelectedUser(null);
    } catch (error) {
      Alert.alert(
        "No se guardó la foto",
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar la foto de perfil. Puedes intentarlo de nuevo.",
      );
    }
  }

  function renderItem({ item }: { item: UserRecord }) {
    const avatarUri = item.picture;
    const locked = isPhotoLocked(item);

    return (
      <Pressable
        onPress={() => {
          setPendingPhotoUri(null);
          setSelectedUser(item);
        }}
        style={[
          styles.card,
          !isDarkMode && { backgroundColor: "#FFFFFF", borderColor: "#D8E0EA" },
          locked && styles.cardRestricted,
        ]}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.userMeta}>
          <Text style={[styles.name, !isDarkMode && { color: "#172033" }]}>
            {item.name}
          </Text>
          <Text style={[styles.email, !isDarkMode && { color: "#087E8B" }]}>
            {item.email}
          </Text>
          <Text style={[styles.phone, !isDarkMode && { color: "#526174" }]}>
            {item.phone}
          </Text>
          <Text style={styles.location}>
            {item.city}, {item.state}
            {item.distanceKm != null
              ? ` • ${item.distanceKm.toFixed(1)} km`
              : ""}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#050816" : "#F4F7FB" },
      ]}
    >
      <Text style={[styles.userLabel, !isDarkMode && { color: "#526174" }]}>
        Cuenta: {userEmail}
      </Text>

      {offline ? (
        <View style={styles.cacheBanner}>
          <Ionicons name="wifi-outline" size={18} color="#FFA500" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.cacheText}>Modo lectura sin conexión</Text>
            <Text style={styles.cacheSubtext}>
              Últimos {users.length} usuarios guardados
              {lastUpdated
                ? ` • ${new Date(lastUpdated).toLocaleString("es-ES", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                : ""}
            </Text>
          </View>
        </View>
      ) : null}

      <TextInput
        onChangeText={setSearch}
        placeholder="Buscar por nombre o email"
        placeholderTextColor="#9ca3af"
        style={[
          styles.searchInput,
          !isDarkMode && {
            backgroundColor: "#FFFFFF",
            borderColor: "#B7C5D6",
            color: "#172033",
          },
        ]}
        value={search}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {users.length === 0 && !offline ? (
        <ActivityIndicator color="#60a5fa" size="large" style={styles.loader} />
      ) : (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={styles.listContent}
          data={filteredUsers}
          keyExtractor={(item) => item.email}
          ListFooterComponent={
            loadingUsers ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#60a5fa" size="small" />
                <Text style={styles.footerLoaderText}>
                  Cargando más usuarios...
                </Text>
              </View>
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selectedUser)}
        onRequestClose={() => {
          setPendingPhotoUri(null);
          setSelectedUser(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              !isDarkMode && {
                backgroundColor: "#FFFFFF",
                borderColor: "#B7C5D6",
              },
              selectedUser &&
                isPhotoLocked(selectedUser) &&
                styles.modalCardRestricted,
            ]}
          >
            {selectedUser && isPhotoLocked(selectedUser) ? (
              <>
                <Text
                  style={[
                    styles.modalTitle,
                    !isDarkMode && { color: "#172033" },
                  ]}
                >
                  Foto no permitida
                </Text>

                <Image
                  source={{ uri: selectedUser.picture }}
                  style={styles.modalAvatar}
                />

                <Text
                  style={[
                    styles.modalSubtitle,
                    !isDarkMode && { color: "#526174" },
                  ]}
                >
                  {selectedUser.name} no ha permitido cambiar su foto de perfil.
                </Text>

                <Pressable
                  onPress={() => setSelectedUser(null)}
                  style={styles.cancelAction}
                >
                  <Text style={styles.cancelText}>Cerrar</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.modalTitle,
                    !isDarkMode && { color: "#172033" },
                  ]}
                >
                  Actualizar foto
                </Text>

                {selectedUser ? (
                  <Image
                    source={{
                      uri: selectedUser.picture,
                    }}
                    style={styles.modalAvatar}
                  />
                ) : null}

                <Text
                  style={[
                    styles.modalSubtitle,
                    !isDarkMode && { color: "#526174" },
                  ]}
                >
                  {selectedUser?.name ?? "Usuario"}
                </Text>

                <Pressable
                  onPress={() => handlePhotoChange("camera")}
                  style={styles.primaryAction}
                >
                  <Text style={styles.actionText}>Tomar foto</Text>
                </Pressable>

                <Pressable
                  onPress={() => handlePhotoChange("library")}
                  style={styles.primaryAction}
                >
                  <Text style={styles.actionText}>Elegir de la galería</Text>
                </Pressable>

                {pendingPhotoUri ? (
                  <Pressable
                    onPress={applyPhotoChanges}
                    style={styles.primaryAction}
                  >
                    <Text style={styles.actionText}>Aplicar cambios</Text>
                  </Pressable>
                ) : null}

                <Pressable
                  onPress={() => {
                    setPendingPhotoUri(null);
                    setSelectedUser(null);
                  }}
                  style={styles.cancelAction}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {showScrollToTop && (
        <Pressable onPress={scrollToTop} style={styles.scrollToTopButton}>
          <Ionicons name="arrow-up" size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
