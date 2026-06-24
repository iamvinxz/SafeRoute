import { useLoginMutation } from "@/redux/authService";
import { clearError, login, loginFailure } from "@/states/authSlice";
import { saveToken } from "@/utils/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [rawPhone, setRawPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const { error } = useSelector((state) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const fullPhone = "+63" + rawPhone;
      const response = await loginMutation({
        phone: fullPhone,
        password,
      }).unwrap();
      await saveToken(response.token);
      dispatch(login({ token: response.token, user: response.user }));
    } catch (err) {
      dispatch(loginFailure(err?.data?.message || "Login failed."));
    }
  };

  return (
    // KeyboardAvoidingView wraps everything so the whole layout shifts up
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
    >
      <View style={style.root}>
        {/* Top blue section */}
        <View style={style.topSection}>
          <SafeAreaView style={style.header}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={style.icon}
              resizeMode="contain"
            />
            <Text style={style.title}>Welcome back,</Text>
            <Text style={style.title}>Login</Text>
          </SafeAreaView>
        </View>

        {/* Bottom gray section */}
        <View style={style.bottomSection}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled" // tapping login button won't dismiss keyboard first
          >
            {/* Phone */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Phone</Text>
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
                  onChangeText={(text) => setRawPhone(text.replace(/\D/g, ""))}
                />
              </View>
            </View>

            {/* Password */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Password</Text>
              <View style={style.passwordWrapper}>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#9a9a9a"
                  style={style.passwordInput}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={style.eyeIcon}
                >
                  <Ionicons
                    name={!showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9a9a9a"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={style.forgotWrapper}>
              <Text style={style.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error */}
            {error && <Text style={style.errorText}>{error}</Text>}

            <View style={style.buttons}>
              <TouchableOpacity
                style={style.loginButton}
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={style.loginButtonText}>Log in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={style.signupButton}
                onPress={() => {
                  dispatch(clearError());
                  router.push("/auth/register");
                }}
              >
                <Text style={style.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#BDD0EE",
  },
  topSection: {
    backgroundColor: "#BDD0EE",
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 60,
    marginBottom: 10,
  },
  header: {
    display: "flex",
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#303030",
    lineHeight: 38,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#5B7FD4",
    marginBottom: 6,
  },
  // 👇 password field split into wrapper + input + icon
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
  forgotWrapper: {
    alignItems: "flex-end",
    marginBottom: 32,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: "#5B7FD4",
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 2,
  },
  loginButton: {
    backgroundColor: "#5B7FD4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  loginButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  signupButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#5B7FD4",
    paddingVertical: 13,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#5B7FD4",
    fontSize: 15,
    fontWeight: "600",
  },
  buttons: {
    marginTop: 10,
    gap: 15,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
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
});

export default Login;
