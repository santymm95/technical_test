import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useAppContext } from "@/context/app-context";
import { styles } from "./analog-clock.styles";

const CLOCK_SIZE = 220;
const CENTER = CLOCK_SIZE / 2;
type HandProps = {
  angle: number;
  length: number;
  width: number;
  color: string;
};

function ClockHand({ angle, length, width, color }: HandProps) {
  return (
    <View
      style={[
        styles.hand,
        {
          height: length,
          marginLeft: -width / 2,
          marginTop: -length,
          transform: [{ rotate: `${angle}deg` }],
          width,
        },
      ]}
    >
      <View style={[styles.handCap, { backgroundColor: color }]} />
    </View>
  );
}

export function AnalogClock({ compact = false }: { compact?: boolean }) {
  const { isDarkMode } = useAppContext();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = hours * 30;

  return (
    <View style={styles.container}>
      <View style={compact ? styles.compactClock : undefined}>
        <View
          style={[
            styles.clock,
            {
              backgroundColor: isDarkMode ? "#07111F" : "#FFFFFF",
              borderColor: isDarkMode ? "#00D9FF" : "#087E8B",
            },
          ]}
        >
          {Array.from({ length: 12 }, (_, index) => {
            const angle = index * 30;
            const radians = (angle * Math.PI) / 180;
            const x = CENTER + Math.sin(radians) * 91 - 3;
            const y = CENTER - Math.cos(radians) * 91 - 3;

            return (
              <View key={angle} style={[styles.marker, { left: x, top: y }]} />
            );
          })}

          <Text style={[styles.number, !isDarkMode && { color: "#172033" }]}>
            {12}
          </Text>
          <Text
            style={[
              styles.number,
              styles.numberThree,
              !isDarkMode && { color: "#172033" },
            ]}
          >
            3
          </Text>
          <Text
            style={[
              styles.number,
              styles.numberSix,
              !isDarkMode && { color: "#172033" },
            ]}
          >
            6
          </Text>
          <Text
            style={[
              styles.number,
              styles.numberNine,
              !isDarkMode && { color: "#172033" },
            ]}
          >
            9
          </Text>

          <View style={styles.hands}>
            <ClockHand
              angle={hourAngle}
              color={isDarkMode ? "#E6F7FF" : "#172033"}
              length={52}
              width={6}
            />
            <ClockHand
              angle={minuteAngle}
              color={isDarkMode ? "#B6F3FF" : "#087E8B"}
              length={76}
              width={4}
            />
            <ClockHand
              angle={secondAngle}
              color="#00D9FF"
              length={84}
              width={2}
            />
            <View style={styles.centerDot} />
          </View>
        </View>
      </View>

      <Text style={styles.dateLabel}>
        {now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Text>
    </View>
  );
}
