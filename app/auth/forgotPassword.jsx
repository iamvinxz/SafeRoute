import { useForgotPasswordMutation } from "@/redux/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const router = useRouter();
  const [rawPhone, setRawPhone] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    if (rawPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    try {
      const fullPhone = "+63" + rawPhone;
      await forgotPassword({ phone: fullPhone }).unwrap();
      router.push({
        pathname: "/auth/verifyOtp",
        params: { phone: fullPhone },
      });
    } catch (err) {
      setError(err?.data?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
    >
      <View style={style.root}>
        {/* Top blue section */}
        <View style={style.topSection}>
          <SafeAreaView style={style.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={style.backButton}
            >
              <Ionicons name="arrow-back" size={22} color="#303030" />
            </TouchableOpacity>
            <Text style={style.title}>Forgot</Text>
            <Text style={style.title}>Password?</Text>
            <Text style={style.subtitle}>
              Enter your registered phone number and we'll send you a
              verification code.
            </Text>
          </SafeAreaView>
        </View>

        {/* Bottom gray section */}
        <View style={style.bottomSection}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={style.fieldGroup}>
              <Text style={style.label}>Phone Number</Text>
              <View style={style.phoneWrapper}>
                <Text style={style.phonePrefix}>+63</Text>
                <View style={style.phoneDivider} />
                <TextInput
                  placeholder="9XXXXXXXXX"
                  placeholderTextColor="#9a9a9a"
                  style={style.phoneInput}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={rawPhone}
                  onChangeText={(text) => {
                    setError("");
                    setRawPhone(text.replace(/\D/g, ""));
                  }}
                />
              </View>
            </View>

            {error ? <Text style={style.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[style.submitButton, isLoading && style.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={style.submitButtonText}>Send Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={style.backToLogin}
              onPress={() => router.back()}
            >
              <Text style={style.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BDD0EE" },
  topSection: {
    backgroundColor: "#BDD0EE",
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 60,
    marginBottom: 10,
  },
  header: { gap: 6 },
  backButton: { marginBottom: 16 },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#303030",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 13,
    color: "#505050",
    marginTop: 10,
    lineHeight: 20,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#5B7FD4",
    marginBottom: 6,
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  phonePrefix: {
    fontSize: 14,
    color: "#1a1a1a",
    paddingVertical: 12,
    paddingRight: 8,
  },
  phoneDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a1a",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 2,
  },
  submitButton: {
    backgroundColor: "#5B7FD4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  disabledButton: { opacity: 0.7 },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  backToLogin: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#5B7FD4",
    paddingVertical: 13,
    alignItems: "center",
  },
  backToLoginText: {
    color: "#5B7FD4",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ForgotPassword;
