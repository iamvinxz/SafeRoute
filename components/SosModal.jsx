import { useSendSosMutation } from "@/redux/sosService";
import { setSosAlert } from "@/states/sosAlertSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const conditions = ["ankle-deep", "knee-deep", "chest-deep", "critical"];

export default function SosModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [numberOfPersons, setNumberOfPersons] = useState();
  const [streetName, setStreetName] = useState();
  const [condition, setCondition] = useState("ankle-deep");
  const [sendSos, { isLoading }] = useSendSosMutation();
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const result = await sendSos({
        coords: { latitude, longitude },
        numberOfPersons: parseInt(numberOfPersons),
        streetName,
        condition,
      }).unwrap();

      const sosId = result.populatedSos._id;

      dispatch(setSosAlert({ sosId, status: "pending" }));

      await AsyncStorage.setItem(
        "activeSos",
        JSON.stringify({ sosId, status: "pending" }),
      );

      setNumberOfPersons("");
      setStreetName("");
      setCondition("ankle-deep");
      onClose();
    } catch (error) {
      setError(error?.data?.message || "Failed to send SOS. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modal}>
                <Text style={styles.title}>Send SOS Signal</Text>
                <Text style={styles.subtitle}>
                  Fill in the details to alert nearby rescuers.
                </Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Number of Persons</Text>
                  <TextInput
                    style={styles.input}
                    value={numberOfPersons}
                    onChangeText={setNumberOfPersons}
                    keyboardType="numeric"
                    placeholder="Enter number of persons"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Street Name</Text>
                  <TextInput
                    style={styles.input}
                    value={streetName}
                    onChangeText={setStreetName}
                    placeholder="Enter street name"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Condition</Text>
                  <View style={styles.conditionRow}>
                    {conditions.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setCondition(c)}
                        style={[
                          styles.conditionBtn,
                          condition === c && styles.conditionBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.conditionText,
                            condition === c && styles.conditionTextActive,
                          ]}
                        >
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setError(null);
                      onClose();
                    }}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.submitText}>Send SOS</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontFamily: "Montserrat",
    textAlign: "center",
    marginTop: -8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#303030",
    fontFamily: "Montserrat",
  },
  subtitle: {
    fontSize: 11,
    color: "#848484",
    fontFamily: "Montserrat",
    marginTop: -8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#303030",
    fontFamily: "Montserrat",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e9f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#303030",
    fontFamily: "Montserrat",
  },
  conditionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e9f0",
    backgroundColor: "white",
  },
  conditionBtnActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  conditionText: {
    fontSize: 11,
    color: "#848484",
    fontFamily: "Montserrat",
    textTransform: "capitalize",
  },
  conditionTextActive: {
    color: "white",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e9f0",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 13,
    color: "#848484",
    fontFamily: "Montserrat",
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },
  submitText: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
});
