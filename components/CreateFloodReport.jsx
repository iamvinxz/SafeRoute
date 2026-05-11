import { isOpen } from "@/states/modalSlice";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera, Check, LucideX, RotateCcw } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const DEPTH_OPTIONS = ["< 0.3m", "0.3m – 0.6m", "0.6m – 1m", "> 1m"];

const CreateFloodReport = () => {
  const dispatch = useDispatch();
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [street, setStreet] = useState("");
  const [depth, setDepth] = useState(null);
  const [description, setDescription] = useState("");

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setPhoto(result.uri);
    setShowCamera(false);
  };

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  const handleSubmit = () => {
    // TODO: dispatch your flood report action
    console.log({ photo, street, depth, description });
    dispatch(isOpen());
  };

  if (showCamera) {
    return (
      <View style={style.overlay}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        >
          <View style={style.cameraUI}>
            <TouchableOpacity
              style={style.cameraClose}
              onPress={() => setShowCamera(false)}
            >
              <LucideX size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={style.shutterBtn} onPress={takePhoto} />
          </View>
        </CameraView>
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
                {photo ? (
                  <>
                    <Image source={{ uri: photo }} style={style.photoPreview} />
                    <TouchableOpacity
                      style={style.retakeBtn}
                      onPress={() => setPhoto(null)}
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
              <Text style={style.label}>Street name</Text>
              <TextInput
                style={style.input}
                placeholder="e.g. Rizal Avenue, Quezon City"
                placeholderTextColor="#bbb"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            {/* Flood Depth */}
            <View style={style.field}>
              <Text style={style.label}>Flood depth</Text>
              <View style={style.depthGrid}>
                {DEPTH_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      style.depthChip,
                      depth === opt && style.depthChipActive,
                    ]}
                    onPress={() => setDepth(opt)}
                  >
                    <Text
                      style={[
                        style.depthChipText,
                        depth === opt && style.depthChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={style.field}>
              <Text style={style.label}>Description</Text>
              <TextInput
                style={[style.input, style.textarea]}
                placeholder="Describe the flood situation..."
                placeholderTextColor="#bbb"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity style={style.submitBtn} onPress={handleSubmit}>
              <Check size={16} color="#fff" />
              <Text style={style.submitText}>Submit Report</Text>
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
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  depthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  depthChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  depthChipActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#1d4ed8",
  },
  depthChipText: {
    fontSize: 13,
    color: "#555",
  },
  depthChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#1d4ed8",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cameraUI: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  cameraClose: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
