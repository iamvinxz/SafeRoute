import { useRegisterMutation } from "@/redux/authService";
import { clearError, loginFailure } from "@/states/authSlice";
import {
  clearRegister,
  setAge,
  setConfirmPassword,
  setIsPwd,
  setPassword,
} from "@/states/registerSlice";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const TERMS = [
  "The app is for emergency alerts and assistance only and does not guarantee immediate rescue. Use the app responsibly — false reports or misuse are strictly prohibited.",
  "Use the app responsibly — false reports or misuse are strictly prohibited.",
  "You agree to share accurate information, including your location, for emergency response.",
  "We are not liable for delays, errors, or damages caused by network or system issues.",
  "Services may be temporarily unavailable due to maintenance or technical problems.",
  "We may update these terms at any time, and continued use means acceptance.",
];

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { age, phone, password, confirmPassword, isPwd } = useSelector(
    (state) => state.register,
  );
  const authError = useSelector((state) => state.auth.error);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const [rawPhone, setRawPhone] = useState("");

  const isFormComplete =
    age?.trim() !== "" &&
    age !== null &&
    rawPhone.length === 10 &&
    password?.length > 0 &&
    confirmPassword?.length > 0 &&
    isPwd !== null &&
    agreedToTerms;

  const handleRegister = async () => {
    try {
      dispatch(clearError());

      const fullPhone = "+63" + rawPhone;

      if (!age || !rawPhone || !password || !confirmPassword) {
        dispatch(loginFailure("Please complete all fields."));
        return;
      }

      if (password !== confirmPassword) {
        dispatch(loginFailure("Passwords do not match."));
        return;
      }

      if (password.length < 6) {
        dispatch(loginFailure("Password must be at least 6 characters."));
        return;
      }

      if (!agreedToTerms) {
        dispatch(loginFailure("You must agree to the Terms & Conditions."));
        return;
      }

      await register({
        age,
        phone: fullPhone,
        password,
        isPWD: isPwd,
      }).unwrap();
      dispatch(clearRegister());
      setRawPhone("");
      Alert.alert("Success", "Account created successfully.");
      router.replace("/auth/login");
    } catch (error) {
      dispatch(loginFailure(error?.data?.message || "Registration failed."));
      console.log(error);
    }
  };

  return (
    <LinearGradient
      className="w-full h-full"
      colors={["#DBD9D9", "#6E8DE0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="items-center mb-7 mt-10">
              <Text style={style.title}>Create account</Text>
              <Text style={style.subtitle}>Sign up to get started</Text>
            </View>

            {/* Card */}
            <View style={style.card}>
              {/* Age */}
              <View className="mb-4">
                <Text style={style.label}>Age</Text>
                <View style={style.inputWrapper}>
                  <Feather name="user" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Enter your age"
                    placeholderTextColor="#9a9a9a"
                    style={style.input}
                    keyboardType="numeric"
                    value={age}
                    onChangeText={(text) => {
                      dispatch(clearError());
                      dispatch(setAge(text));
                    }}
                  />
                </View>
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text style={style.label}>Phone</Text>
                <View style={style.inputWrapper}>
                  <Feather name="phone" size={16} color="#6b6b6b" />
                  {/* Locked prefix */}
                  <Text style={style.phonePrefix}>+63</Text>
                  <View style={style.phoneDivider} />
                  <TextInput
                    placeholder="9XXXXXXXXX"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={rawPhone}
                    onChangeText={(text) => {
                      dispatch(clearError());
                      // strip anything that isn't a digit
                      setRawPhone(text.replace(/\D/g, ""));
                    }}
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text style={style.label}>Password</Text>
                <View style={style.inputWrapper}>
                  <Feather name="lock" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Create your password"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(text) => {
                      dispatch(clearError());
                      dispatch(setPassword(text));
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={16}
                      color="#9a9a9a"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-5">
                <Text style={style.label}>Confirm Password</Text>
                <View style={style.inputWrapper}>
                  <Feather name="lock" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Confirm your password"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      dispatch(clearError());
                      dispatch(setConfirmPassword(text));
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                  >
                    <Feather
                      name={showConfirm ? "eye-off" : "eye"}
                      size={16}
                      color="#9a9a9a"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Are you a PWD? */}
              <View className="mb-5">
                <Text style={style.label}>Are you a PWD?</Text>
                <View style={style.radioGroup}>
                  <TouchableOpacity
                    style={style.radioOption}
                    onPress={() => dispatch(setIsPwd(true))}
                  >
                    <View style={style.radioOuter}>
                      {isPwd === true && <View style={style.radioInner} />}
                    </View>
                    <Text style={style.radioLabel}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.radioOption}
                    onPress={() => dispatch(setIsPwd(false))}
                  >
                    <View style={style.radioOuter}>
                      {isPwd === false && <View style={style.radioInner} />}
                    </View>
                    <Text style={style.radioLabel}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms & Conditions Checkbox */}
              <View style={style.termsRow}>
                <TouchableOpacity
                  onPress={() => setAgreedToTerms((prev) => !prev)}
                  style={style.checkbox}
                  activeOpacity={0.7}
                >
                  {agreedToTerms ? (
                    <Feather name="check-square" size={20} color="#6E8DE0" />
                  ) : (
                    <Feather name="square" size={20} color="#9a9a9a" />
                  )}
                </TouchableOpacity>
                <Text style={style.termsText}>
                  I agree to the{" "}
                  <Text
                    style={style.termsLink}
                    onPress={() => setTermsModalVisible(true)}
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              {authError && <Text style={style.errorText}>{authError}</Text>}

              {/* Buttons */}
              <View style={style.buttonCtn}>
                <TouchableOpacity
                  style={[
                    style.button,
                    !isFormComplete && style.buttonDisabled,
                  ]}
                  activeOpacity={isFormComplete ? 0.85 : 1}
                  onPress={handleRegister}
                  disabled={!isFormComplete || isLoading}
                >
                  <Text style={style.buttonText}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.clearBtn}
                  onPress={() => {
                    dispatch(clearRegister());
                    setRawPhone("");
                  }}
                >
                  <Text style={style.clearBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign in link */}
            <View className="flex-row justify-center mt-5">
              <Text style={style.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("auth/login")}>
                <Text style={style.footerLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Terms & Conditions Modal */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <Pressable
          style={style.modalOverlay}
          onPress={() => setTermsModalVisible(false)}
        >
          {/* Pressable inside stops the overlay close from firing when tapping the card */}
          <Pressable style={style.modalCard} onPress={() => {}}>
            {/* Header */}
            <View style={style.modalHeader}>
              <Text style={style.modalTitle}>Terms & Conditions</Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Feather name="x" size={20} color="#3a3a3a" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <Text style={style.modalIntro}>
                By using this app, you agree to the following:
              </Text>
              {TERMS.map((item, index) => (
                <View key={index} style={style.termItem}>
                  <View style={style.termBullet} />
                  <Text style={style.termItemText}>{item}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Agree button */}
            <TouchableOpacity
              style={style.modalAgreeBtn}
              onPress={() => {
                setAgreedToTerms(true);
                setTermsModalVisible(false);
              }}
            >
              <Text style={style.modalAgreeBtnText}>I Agree</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  title: {
    fontFamily: "Montserrat",
    fontSize: 26,
    color: "#1a1a1a",
  },
  subtitle: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#4a4a4a",
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.7)",
    marginHorizontal: 20,
  },
  label: {
    fontFamily: "Montserrat",
    fontSize: 12,
    color: "#2d2d2d",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.60)",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  input: {
    flex: 1,
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#2d2d2d",
    padding: 0,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 24,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6E8DE0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6E8DE0",
  },
  radioLabel: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#2d2d2d",
  },
  // Terms checkbox row
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  checkbox: {
    padding: 2,
  },
  termsText: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#2d2d2d",
    flexShrink: 1,
  },
  termsLink: {
    color: "#2a50a8",
    textDecorationLine: "underline",
  },
  buttonCtn: {
    gap: 10,
  },
  button: {
    backgroundColor: "#6E8DE0",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#b0bfef",
  },
  clearBtn: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: {
    fontFamily: "Montserrat",
    fontSize: 14,
  },
  buttonText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#fff",
  },
  footerText: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#3a3a3a",
  },
  footerLink: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#2a50a8",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Montserrat",
    textAlign: "center",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: "#1a1a1a",
  },
  modalIntro: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#4a4a4a",
    marginBottom: 14,
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  termBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6E8DE0",
    marginTop: 6,
  },
  termItemText: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#3a3a3a",
    lineHeight: 20,
    flex: 1,
  },
  modalAgreeBtn: {
    backgroundColor: "#6E8DE0",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 16,
  },
  modalAgreeBtnText: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#fff",
  },
  phonePrefix: {
    fontFamily: "Montserrat",
    fontSize: 13,
    color: "#2d2d2d",
    paddingRight: 8,
  },
  phoneDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginRight: 8,
  },
});

export default Register;
