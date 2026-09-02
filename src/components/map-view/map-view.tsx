import type { ViewStyle } from "react-native";
import { View } from "react-native";

export type MapLocation = {
  latitude: number;
  longitude: number;
  title?: string;
};

export function MapViewComponent({
  locations,
  style,
}: {
  locations?: MapLocation[];
  style?: ViewStyle;
}) {
  return <View style={style} />;
}
