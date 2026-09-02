import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const TOKEN_KEY = "appmovil.secure.token";
const USER_EMAIL_KEY = "appmovil.secure.email";
const USERS_CACHE_KEY = "appmovil.cached.users";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  picture?: string;
  city?: string;
  state?: string;
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
};

type CachedUsersPayload = {
  users: UserRecord[];
  fetchedAt: string;
};

type AppContextValue = {
  token: string | null;
  userEmail: string | null;
  users: UserRecord[];
  offline: boolean;
  loadingUsers: boolean;
  loginLoading: boolean;
  sessionReady: boolean;
  errorMessage: string | null;
  lastUpdated: string | null;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  simulateLogin: (email: string) => Promise<void>;
  fetchUsers: (reset?: boolean) => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

async function hashString(value: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
}

async function readCachedUsers(): Promise<UserRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_CACHE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CachedUsersPayload;
    return Array.isArray(parsed?.users) ? parsed.users : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [users, setUsersState] = useState<UserRecord[]>([]);
  const [offline, setOffline] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [userPage, setUserPage] = useState(1);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const savedEmail = await SecureStore.getItemAsync(USER_EMAIL_KEY);

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedEmail) {
          setUserEmail(savedEmail);
        }

        const cachedUsers = await readCachedUsers();
        if (cachedUsers.length > 0) {
          setUsersState(cachedUsers);
        }

        const raw = await AsyncStorage.getItem(USERS_CACHE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as CachedUsersPayload;
            if (parsed?.fetchedAt) {
              setLastUpdated(parsed.fetchedAt);
            }
          } catch {
            // Ignore parse errors
          }
        }
      } finally {
        setSessionReady(true);
      }
    }

    hydrateSession();
  }, []);

  async function persistUsers(nextUsers: UserRecord[]) {
    const now = new Date().toISOString();
    setUsersState(nextUsers);
    setLastUpdated(now);
    await AsyncStorage.setItem(
      USERS_CACHE_KEY,
      JSON.stringify({ users: nextUsers, fetchedAt: now }),
    );
  }

  async function fetchUsers(reset = false) {
    if (loadingUsers) {
      return;
    }

    setLoadingUsers(true);
    setErrorMessage(null);

    try {
      const nextPage = reset ? 1 : userPage + 1;
      const response = await fetch(
        `https://randomuser.me/api/0.8/?page=${nextPage}&results=20`,
        { signal: AbortSignal.timeout(10000) },
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar la lista de usuarios.");
      }

      const payload = await response.json();
      const nextUsers = (payload?.results ?? []).map(
        (entry: Record<string, any>, index: number) => {
          const user = entry?.user ?? entry;
          const name =
            user?.name && typeof user.name === "object"
              ? `${user.name.first ?? ""} ${user.name.last ?? ""}`.trim()
              : "Usuario sin nombre";

          const latitude = Number(
            user?.location?.latitude ?? user?.latitude ?? null,
          );
          const longitude = Number(
            user?.location?.longitude ?? user?.longitude ?? null,
          );

          return {
            id: user?.email ?? `${name}-${index}`,
            name,
            email: user?.email ?? "email@desconocido.com",
            phone: user?.phone ?? "Sin número",
            picture: user?.picture?.large ?? user?.picture?.medium ?? undefined,
            city: user?.location?.city ?? "Sin ciudad",
            state: user?.location?.state ?? "Sin estado",
            latitude: Number.isFinite(latitude) ? latitude : null,
            longitude: Number.isFinite(longitude) ? longitude : null,
            distanceKm: null,
          } as UserRecord;
        },
      );

      const mergedUsers = reset ? nextUsers : [...users, ...nextUsers];

      // Remove duplicates by email
      const uniqueUsers = Array.from(
        new Map(mergedUsers.map((user: UserRecord) => [user.email, user])).values(),
      ) as UserRecord[];

      setUserPage(nextPage);
      await persistUsers(uniqueUsers);
      setOffline(false);
    } catch (error) {
      const cachedUsers = await readCachedUsers();

      if (cachedUsers.length > 0) {
        setUsersState(cachedUsers);
        setOffline(true);

        const errorMsg =
          error instanceof Error ? error.message : "Sin conexión";
        if (errorMsg.includes("timeout")) {
          setErrorMessage("Conexión lenta. Mostrando últimos datos guardados.");
        } else {
          setErrorMessage("Sin conexión. Usando últimos datos guardados.");
        }
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la lista de usuarios.",
      );
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loginWithEmailPassword(email: string, password: string) {
    if (!email.trim() || !password.trim()) {
      throw new Error("Ingresa correo y contraseña.");
    }

    setLoginLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error ??
            "Credenciales inválidas. Prueba eve.holt@reqres.in / cityslicka",
        );
      }

      const data = await response.json();
      const tokenValue = String(data?.token ?? "");

      if (!tokenValue) {
        throw new Error("La API no devolvió un token válido.");
      }

      const secureToken = await hashString(tokenValue);
      await SecureStore.setItemAsync(TOKEN_KEY, secureToken);
      await SecureStore.setItemAsync(USER_EMAIL_KEY, email.trim());
      setToken(secureToken);
      setUserEmail(email.trim());
    } finally {
      setLoginLoading(false);
    }
  }

  async function simulateLogin(email: string) {
    if (!email.trim()) {
      throw new Error("Ingresa un correo electrónico.");
    }

    setLoginLoading(true);
    setErrorMessage(null);

    try {
      // Generar un token simulado
      const simulatedToken = await hashString(
        `simulated-${email}-${Date.now()}`,
      );
      await SecureStore.setItemAsync(TOKEN_KEY, simulatedToken);
      await SecureStore.setItemAsync(USER_EMAIL_KEY, email.trim());
      setToken(simulatedToken);
      setUserEmail(email.trim());
    } finally {
      setLoginLoading(false);
    }
  }

  async function logOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
    setToken(null);
    setUserEmail(null);
    setOffline(false);
    setErrorMessage(null);
  }

  const value = useMemo<AppContextValue>(
    () => ({
      token,
      userEmail,
      users,
      offline,
      loadingUsers,
      loginLoading,
      sessionReady,
      errorMessage,
      lastUpdated,
      loginWithEmailPassword,
      simulateLogin,
      fetchUsers,
      logOut,
      clearError: () => setErrorMessage(null),
    }),
    [
      token,
      userEmail,
      users,
      offline,
      loadingUsers,
      loginLoading,
      sessionReady,
      errorMessage,
      lastUpdated,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
