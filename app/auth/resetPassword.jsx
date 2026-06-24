import { useResetPasswordMutation } from "@/redux/authService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const ResetPassword = () => {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      await resetPassword({ phone, newPassword, confirmPassword }).unwrap();
      router.replace("/auth/login");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong.");
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
            <Text style={style.title}>Reset</Text>
            <Text style={style.title}>Password</Text>
            <Text style={style.subtitle}>
              Choose a new password for your account. Make it something you'll
              remember.
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
            {/* New Password */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>New Password</Text>
              <View style={style.passwordWrapper}>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#9a9a9a"
                  style={style.passwordInput}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={(text) => {
                    setError("");
                    setNewPassword(text);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowNew((prev) => !prev)}
                  style={style.eyeIcon}
                >
                  <Ionicons
                    name={!showNew ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9a9a9a"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Confirm Password</Text>
              <View style={style.passwordWrapper}>
                <TextInput
                  placeholder="Re-enter new password"
                  placeholderTextColor="#9a9a9a"
                  style={style.passwordInput}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setError("");
                    setConfirmPassword(text);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((prev) => !prev)}
                  style={style.eyeIcon}
                >
                  <Ionicons
                    name={!showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9a9a9a"
                  />
                </TouchableOpacity>
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
                <Text style={style.submitButtonText}>Reset Password</Text>
              )}
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a1a",
  },
  eyeIcon: {
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  },
  disabledButton: { opacity: 0.7 },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ResetPassword;
