import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppContext } from "@/context/app-context";
import { styles } from "./dashboard-screen.styles";

const stats = [
  {
    label: "Usuarios",
    value: "1,284",
    change: "+12.4%",
    icon: "people-outline",
    tint: "#60a5fa",
  },
  {
    label: "Ventas",
    value: "$24.8K",
    change: "+8.1%",
    icon: "cash-outline",
    tint: "#34d399",
  },
  {
    label: "Pedidos",
    value: "428",
    change: "+5.6%",
    icon: "bag-outline",
    tint: "#fbbf24",
  },
  {
    label: "Soporte",
    value: "96%",
    change: "+2.3%",
    icon: "chatbubbles-outline",
    tint: "#a78bfa",
  },
];

const quickActions = [
  { label: "Clientes", icon: "person-outline" },
  { label: "Reportes", icon: "bar-chart-outline" },
  { label: "Inventario", icon: "cube-outline" },
  { label: "Configuración", icon: "settings-outline" },
];

const activity = [
  { title: "Nuevo registro", detail: "Ana García se unió hoy", time: "2h" },
  { title: "Pago aprobado", detail: "Factura #2048 confirmada", time: "4h" },
  {
    title: "Inventario actualizado",
    detail: "12 productos sincronizados",
    time: "6h",
  },
  { title: "Soporte resuelto", detail: "Caso #443 cerrado", time: "8h" },
];

export default function DashboardScreen() {
  const { userEmail, logOut } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Panel general</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>{userEmail ?? "Usuario"}</Text>
          </View>

          <Pressable onPress={() => logOut()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Resumen del día</Text>
            <Text style={styles.heroValue}>$18,420</Text>
            <Text style={styles.heroTrend}>↑ 14.8% respecto al mes pasado</Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name="trending-up-outline" color="#0f172a" size={22} />
          </View>
        </View>

        <View style={styles.grid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.metricCard}>
              <View
                style={[
                  styles.metricIcon,
                  { backgroundColor: `${item.tint}22` },
                ]}
              >
                <Ionicons name={item.icon as any} color={item.tint} size={20} />
              </View>
              <Text style={styles.metricLabel}>{item.label}</Text>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={[styles.metricChange, { color: item.tint }]}>
                {item.change}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        </View>

        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <Pressable key={action.label} style={styles.actionButton}>
              <Ionicons name={action.icon as any} color="#e2e8f0" size={20} />
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>

          {activity.map((item) => (
            <View key={item.title} style={styles.activityRow}>
              <View style={styles.dot} />
              <View style={styles.activityTextWrap}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
