import type { ViewStyle } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

export type MapLocation = {
  latitude: number;
  longitude: number;
  title?: string;
};

export function MapViewComponent({
  locations,
  userLocation,
  style,
}: {
  locations?: MapLocation[];
  userLocation?: MapLocation;
  style?: ViewStyle;
}) {
  const initialLocation = userLocation ?? locations?.[0];

  if (!initialLocation) {
    return null;
  }

  const region: Region = {
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.25,
    longitudeDelta: 0.25,
  };

  return (
    <MapView initialRegion={region} showsUserLocation style={style}>
      {userLocation ? (
        <Marker
          coordinate={userLocation}
          pinColor="#00D9FF"
          title="Tu ubicación"
        />
      ) : null}
      {locations?.map((location) => (
        <Marker
          key={`${location.latitude}-${location.longitude}-${location.title}`}
          coordinate={location}
          title={location.title}
        />
      ))}
    </MapView>
  );
}
