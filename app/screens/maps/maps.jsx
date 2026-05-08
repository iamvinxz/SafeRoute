import Maps from "@/components/Maps";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MapsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 90 }]}>
      <Maps
        lat={14.6709}
        lng={120.9696}
        onMapPress={({ latitude, longitude }) => {
          console.log("Pressed:", latitude, longitude);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
