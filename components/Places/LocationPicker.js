import { View, StyleSheet, Alert } from "react-native";
import { Colors } from "../../constants/colors";
import { OutlineButton } from "../ui/OutlineButton";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";

import MapView, { Marker } from "react-native-maps";
import { useEffect, useLayoutEffect, useState } from "react";

export function LocationPicker() {
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [region, setRegion] = useState(null);

  //   const region = {
  //     latitude: 37.78,
  //     longitude: -122.43,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   };

  useEffect(() => {
    getLocationHandler();
  }, []);

  function selectLocationHandler(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  async function verifyPermissions() {
    if (locationPermissionInformation) {
      if (
        locationPermissionInformation.status === PermissionStatus.UNDETERMINED
      ) {
        const permissionResponse = await requestPermission();

        return permissionResponse.granted;
      }

      if (locationPermissionInformation.status === PermissionStatus.DENIED) {
        Alert.alert(
          "Insufficient Permissions!",
          "You need to grant location permissions to use this app"
        );
        return false;
      }

      return true;
    }
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    console.log(hasPermission);

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();

    // region.latitude = location.coords.latitude;
    // region.longitude = location.coords.longitude;

    setRegion({
      latitude: location.coords.latitude,
      latitude: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {}
  return (
    <View>
      <View style={styles.mapPreview}>
        {region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={selectLocationHandler}
          >
            {selectedLocation && (
              <Marker
                title="Picked Location"
                coordinate={{
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                }}
              />
            )}
          </MapView>
        )}
      </View>
      <View style={styles.actions}>
        <OutlineButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlineButton>
        <OutlineButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlineButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  map: {
    minHeight: "100%",
    minWidth: "100%",
  },
});
