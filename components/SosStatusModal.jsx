import { clearSosAlert, toggleShowModal } from "@/states/sosAlertSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function SosStatusModal() {
  const dispatch = useDispatch();
  const { showModal, status } = useSelector((state) => state.sosAlert);

  const isPending = status === "pending";
  const isDispatched = status === "dispatched";
  const isResponded = status === "responded";
  const isResolved = status === "resolved";

  const handleClose = async () => {
    if (isResolved) {
      await AsyncStorage.removeItem("activeSos");
      dispatch(clearSosAlert());
      return;
    }
    dispatch(toggleShowModal());
  };

  return (
    <Modal visible={showModal} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {isPending && (
            <>
              <Text style={styles.emoji}>🕐</Text>
              <Text style={styles.title}>SOS Sent</Text>
              <Text style={styles.subtitle}>
                Your SOS has been received. Waiting for a rescuer to be
                dispatched...
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose}>
                <Text style={styles.btnText}>Okay</Text>
              </TouchableOpacity>
            </>
          )}

          {isDispatched && (
            <>
              <Text style={styles.emoji}>🚨</Text>
              <Text style={styles.title}>Rescuer on the way</Text>
              <Text style={styles.subtitle}>
                A rescuer has been dispatched to your location. Please stay safe
                and remain at your location.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose}>
                <Text style={styles.btnText}>Got it</Text>
              </TouchableOpacity>
            </>
          )}

          {isResponded && (
            <>
              <Text style={styles.emoji}>✅</Text>
              <Text style={styles.title}>Rescuer got you now!</Text>
              <Text style={styles.subtitle}>
                Please be guided and follow any instruction our rescuer
                requested you to accomplish. Once you arrived on the evacuation
                center assistance will be proviced.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose}>
                <Text style={styles.btnText}>Got it</Text>
              </TouchableOpacity>
            </>
          )}

          {isResolved && (
            <>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.title}>You're safe now!</Text>
              <Text style={styles.subtitle}>
                Your SOS has been resolved. We're glad you're safe. Please
                proceed to the evacuation center if needed.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 28,
    gap: 12,
    width: "100%",
  },

  emoji: {
    fontSize: 40,
    textAlign: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#303030",
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    color: "#848484",
    fontFamily: "Montserrat",
    textAlign: "center",
    lineHeight: 18,
  },

  btn: {
    marginTop: 8,
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 13,
  },
});
