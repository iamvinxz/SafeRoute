import { toggleShowModal } from "@/states/sosAlertSlice";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function SosStatusModal() {
  const dispatch = useDispatch();
  const { showModal, status } = useSelector((state) => state.sosAlert);

  const isPending = status === "pending";
  const isDispatched = status === "dispatched";

  const handleClose = async () => {
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
              <Text style={styles.title}>Rescuer On The Way</Text>
              <Text style={styles.subtitle}>
                A rescuer has been dispatched to your location. Please stay safe
                and remain at your location.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClose}>
                <Text style={styles.btnText}>Got it</Text>
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
