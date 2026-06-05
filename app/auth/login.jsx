import { useLoginMutation } from "@/redux/authService";
import { clearError, login, loginFailure } from "@/states/authSlice";
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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { error } = useSelector((state) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await loginMutation({ phone, password }).unwrap();
      console.log(response);
      dispatch(login({ token: response.token, user: response.user }));
    } catch (err) {
      dispatch(loginFailure(err.data.message));
    }
  };

  return (
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

      {/* Bottom gray section with rounded top */}
      <View style={style.bottomSection}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Phone */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Phone</Text>
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#9a9a9a"
                style={style.input}
                keyboardType="phone-pad"
                autoCapitalize="none"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Password */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9a9a9a"
                style={style.input}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={style.forgotWrapper}>
              <Text style={style.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error */}
            {error && <Text style={style.errorText}>{error}</Text>}

            <View style={style.buttons}>
              {/* Log In Button */}
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

              {/* Sign Up Button */}
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
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#BDD0EE", // blue top bg
    color: "#303030",
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
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a1a",
    borderWidth: 0,
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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
    display: "flex",
    gap: 15,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
});

export default Login;
