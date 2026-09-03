import MapView, { Marker, type Region } from "react-native-maps";
import type { ViewStyle } from "react-native";

type MapPoint = {
  latitude: number;
  longitude: number;
  title: string;
  pinColor?: string;
};

type MapaProps = {
  center: MapPoint;
  points: MapPoint[];
  style?: ViewStyle;
};

export function Mapa({ center, points, style }: MapaProps) {
  const region: Region = {
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <MapView
      initialRegion={region}
      showsCompass
      showsUserLocation={false}
      style={style}
    >
      <Marker
        coordinate={center}
        pinColor={center.pinColor ?? "#00D9FF"}
        title={center.title}
      />
      {points.map((point, index) => (
        <Marker
          coordinate={point}
          key={`${point.title}-${point.latitude}-${point.longitude}-${index}`}
          pinColor={point.pinColor ?? "#FF7187"}
          title={point.title}
        />
      ))}
    </MapView>
  );
}
