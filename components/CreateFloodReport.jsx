import { useCreateFloodReportMutation } from "@/redux/floodReport";
import {
  resetReport,
  setCoords,
  setDescription,
  setFloodDepth,
  setPhotoUrl,
  setStreetName,
} from "@/states/floodReportSlice";
import { isOpen } from "@/states/modalSlice";
import { streets } from "@/utils/streets";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import {
  Camera,
  Check,
  ChevronDown,
  LucideX,
  MapPin,
  RotateCcw,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const DEPTH_OPTIONS = ["Ankle-Deep", "Knee-Deep", "Chest-Deep", "Critical"];

const CreateFloodReport = () => {
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [depthOpen, setDepthOpen] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);
  const [streetSearch, setStreetSearch] = useState("");
  const [locating, setLocating] = useState(false);

  //rtk query
  const [createReport, { isLoading: creatingReport }] =
    useCreateFloodReportMutation();

  const { streetName, floodDepth, photoUrl, description, coords } = useSelector(
    (state) => state.report,
  );

  const filteredStreets = streets.filter((s) =>
    s.name.toLowerCase().includes(streetSearch.toLowerCase()),
  );

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    dispatch(setPhotoUrl(result.uri));
    setShowCamera(false);
  };

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  const autofillLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      dispatch(setCoords([current.coords.latitude, current.coords.longitude]));

      const [address] = await Location.reverseGeocodeAsync(current.coords);

      // Try to match against streets list
      const matched = streets.find((s) =>
        s.name.toLowerCase().includes(address.street?.toLowerCase() ?? ""),
      );

      dispatch(
        setStreetName(
          matched ? matched.name : (address.street ?? "Unknown street"),
        ),
      );
    } catch (e) {
      console.error("Location error:", e);
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("streetName", streetName);
      formData.append("floodDepth", floodDepth.toLowerCase());
      formData.append("description", description);
      formData.append("latitude", coords[0]);
      formData.append("longitude", coords[1]);
      formData.append("image", {
        uri: photoUrl,
        name: photoUrl.split("/").pop(),
        type: "image/jpg",
      });

      const result = await createReport(formData).unwrap();

      dispatch(resetReport());
      dispatch(isOpen());
    } catch (error) {
      console.log(error);
    }
  };

  if (showCamera) {
    return (
      <View style={style.overlay}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        />

        <TouchableOpacity
          style={style.cameraClose}
          onPress={() => setShowCamera(false)}
        >
          <LucideX size={20} color="#fff" />
        </TouchableOpacity>

        <View style={style.cameraUI}>
          <TouchableOpacity style={style.shutterBtn} onPress={takePhoto} />
        </View>
      </View>
    );
  }

  return (
    <View style={style.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={style.container}>
          {/* Header */}
          <View style={style.header}>
            <Text style={style.title}>Create Flood Report</Text>
            <TouchableOpacity
              onPress={() => dispatch(isOpen())}
              style={style.closeBtn}
            >
              <LucideX size={18} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={style.form}
          >
            {/* Photo */}
            <View style={style.field}>
              <Text style={style.label}>Photo</Text>
              <TouchableOpacity
                style={style.photoBox}
                onPress={handleCameraPress}
              >
                {photoUrl ? (
                  <>
                    <Image
                      source={{ uri: photoUrl }}
                      style={style.photoPreview}
                    />
                    <TouchableOpacity
                      style={style.retakeBtn}
                      onPress={() => dispatch(setPhotoUrl(null))}
                    >
                      <RotateCcw size={14} color="#fff" />
                      <Text style={style.retakeText}>Retake</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={style.photoPlaceholder}>
                    <Camera size={28} color="#aaa" />
                    <Text style={style.photoHint}>Tap to take a photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Street Name */}
            <View style={style.field}>
              <View style={style.labelRow}>
                <Text style={style.label}>Street name</Text>
                <TouchableOpacity
                  style={style.locationBtn}
                  onPress={autofillLocation}
                  disabled={locating}
                >
                  {locating ? (
                    <ActivityIndicator size={12} color="#1d4ed8" />
                  ) : (
                    <MapPin size={13} color="#1d4ed8" />
                  )}
                  <Text style={style.locationBtnText}>
                    {locating ? "Locating..." : "Use my location"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={style.dropdown}
                onPress={() => setStreetOpen(true)}
              >
                <Text
                  style={
                    streetName
                      ? style.dropdownSelected
                      : style.dropdownPlaceholder
                  }
                >
                  {streetName || "Select a street"}
                </Text>
                <ChevronDown size={16} color="#888" />
              </TouchableOpacity>

              <Modal
                visible={streetOpen}
                transparent
                animationType="fade"
                onRequestClose={() => {
                  setStreetOpen(false);
                  setStreetSearch("");
                }}
              >
                <TouchableOpacity
                  style={style.modalBackdrop}
                  activeOpacity={1}
                  onPress={() => {
                    setStreetOpen(false);
                    setStreetSearch("");
                  }}
                >
                  <View
                    style={style.dropdownMenu}
                    onStartShouldSetResponder={() => true}
                  >
                    <View style={style.searchBox}>
                      <TextInput
                        style={style.searchInput}
                        placeholder="Search street..."
                        placeholderTextColor="#bbb"
                        value={streetSearch}
                        onChangeText={setStreetSearch}
                        autoFocus
                      />
                    </View>

                    <ScrollView
                      style={{ maxHeight: 280 }}
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredStreets.length === 0 ? (
                        <Text style={style.noResult}>No streets found</Text>
                      ) : (
                        // ✅ Fix 2: renamed param to `s`, and fixed check mark condition
                        filteredStreets.map((s) => (
                          <TouchableOpacity
                            key={s.name}
                            style={style.dropdownItem}
                            onPress={() => {
                              dispatch(setStreetName(s.name));
                              setStreetOpen(false);
                              setStreetSearch("");
                            }}
                          >
                            <Text style={style.dropdownItemText}>{s.name}</Text>
                            {streetName === s.name && (
                              <Check size={16} color="#1d4ed8" />
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            {/* Flood Depth */}
            <View style={style.field}>
              <Text style={style.label}>Flood depth</Text>

              <TouchableOpacity
                style={style.dropdown}
                onPress={() => setDepthOpen(true)}
              >
                <Text
                  style={
                    floodDepth
                      ? style.dropdownSelected
                      : style.dropdownPlaceholder
                  }
                >
                  {floodDepth ?? "Select flood depth"}
                </Text>
                <ChevronDown size={16} color="#888" />
              </TouchableOpacity>

              <Modal
                visible={depthOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setDepthOpen(false)}
              >
                <TouchableOpacity
                  style={style.modalBackdrop}
                  activeOpacity={1}
                  onPress={() => setDepthOpen(false)}
                >
                  <View style={style.dropdownMenu}>
                    {DEPTH_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={style.dropdownItem}
                        onPress={() => {
                          dispatch(setFloodDepth(opt));
                          setDepthOpen(false);
                        }}
                      >
                        <Text style={style.dropdownItemText}>{opt}</Text>
                        {floodDepth === opt && (
                          <Check size={16} color="#1d4ed8" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            {/* Description */}
            <View style={style.field}>
              <Text style={style.label}>Description</Text>
              <TextInput
                style={[style.input, style.textarea]}
                placeholder="Describe the flood situation..."
                placeholderTextColor="#bbb"
                value={description}
                onChangeText={(text) => dispatch(setDescription(text))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity style={style.submitBtn} onPress={handleSubmit}>
              {creatingReport ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={style.submit}>
                  <Check size={16} color="#fff" />
                  <Text style={style.submitText}>Submit Report</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateFloodReport;

const style = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 12,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    top: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    padding: 16,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationBtnText: {
    fontSize: 12,
    color: "#1d4ed8",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  textarea: {
    height: 100,
    paddingTop: 11,
  },
  photoBox: {
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoHint: {
    fontSize: 13,
    color: "#aaa",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },
  retakeBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  retakeText: {
    color: "#fff",
    fontSize: 12,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#fafafa",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#bbb",
  },
  dropdownSelected: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 1,
  },
  submitBtn: {
    backgroundColor: "#1d4ed8",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cameraUI: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cameraClose: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  searchBox: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1a1a1a",
  },
  noResult: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 13,
    paddingVertical: 20,
  },
});
