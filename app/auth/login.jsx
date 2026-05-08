import { useLoginMutation } from "@/redux/authService";
import { login, loginFailure } from "@/states/authSlice";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const response = await loginMutation({
        phone,
        password,
      }).unwrap();
      console.log("Login response:", response);

      dispatch(login({ token: response.token }));
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure(error.message));
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="items-center mb-7 mt-10">
              <Text style={style.title}>Welcome Back</Text>
              <Text style={style.subtitle}>Sign in to continue</Text>
            </View>

            {/* Card */}
            <View style={style.card}>
              {/* PHone */}
              <View className="mb-4">
                <Text style={style.label}>Email</Text>
                <View style={style.inputWrapper}>
                  <Feather name="mail" size={16} color="#6b6b6b" />
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
              </View>

              {/* Password */}
              <View className="mb-6">
                <Text style={style.label}>Password</Text>
                <View style={style.inputWrapper}>
                  <Feather name="lock" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
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

              {/* Sign In Button */}
              <TouchableOpacity style={style.button} onPress={handleLogin}>
                {isLoggingIn ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={style.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-6">
              <Text style={style.linkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text
                  style={[
                    style.linkText,
                    { color: "#6E8DE0", fontWeight: "600" },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const style = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#1a1a1a",
  },
  button: {
    backgroundColor: "#6E8DE0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
});

export default Login;
