import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
} from "@/redux/authService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [forgotPassword] = useForgotPasswordMutation();

  const handleChange = (text, index) => {
    const digit = text.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    try {
      await verifyResetOtp({ phone, otp }).unwrap();
      router.push({
        pathname: "/auth/resetPassword",
        params: { phone },
      });
    } catch (err) {
      setError(err?.data?.message || "Invalid or expired code.");
    }
  };

  const handleResend = async () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    try {
      await forgotPassword({ phone }).unwrap();
    } catch {
      // silently fail — backend returns generic message anyway
    }
  };

  const maskedPhone = phone
    ? phone.slice(0, 6) + "****" + phone.slice(-2)
    : "your number";

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
            <Text style={style.title}>Enter</Text>
            <Text style={style.title}>Verification Code</Text>
            <Text style={style.subtitle}>
              We sent a 6-digit code to {maskedPhone}. It expires in 10 minutes.
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
            <Text style={style.label}>Verification Code</Text>

            {/* 6 OTP boxes */}
            <View style={style.otpRow}>
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[style.otpBox, digit ? style.otpBoxFilled : null]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  caretHidden
                />
              ))}
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
                <Text style={style.submitButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <View style={style.resendRow}>
              <Text style={style.resendText}>Didn't receive a code? </Text>
              <TouchableOpacity onPress={handleResend}>
                <Text style={style.resendLink}>Resend</Text>
              </TouchableOpacity>
            </View>
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
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#5B7FD4",
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 46,
    height: 56,
    backgroundColor: "white",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  otpBoxFilled: {
    borderColor: "#5B7FD4",
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
    marginBottom: 14,
  },
  disabledButton: { opacity: 0.7 },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  resendText: {
    fontSize: 13,
    color: "#777",
  },
  resendLink: {
    fontSize: 13,
    color: "#5B7FD4",
    fontWeight: "600",
  },
});

export default VerifyOtp;
