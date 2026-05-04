import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

const Register = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          >
            {/* Header */}
            <View className="items-center mb-7">
              <Text style={style.title}>Create account</Text>
              <Text style={style.subtitle}>Sign up to get started</Text>
            </View>

            {/* Card */}
            <View style={style.card}>

              {/* Full name */}
              <View className="mb-4">
                <Text style={style.label}>Full name</Text>
                <View style={style.inputWrapper}>
                  <Feather name="user" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Juan dela Cruz"
                    placeholderTextColor="#9a9a9a"
                    style={style.input}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text style={style.label}>Email</Text>
                <View style={style.inputWrapper}>
                  <Feather name="mail" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="juan@email.com"
                    placeholderTextColor="#9a9a9a"
                    style={style.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text style={style.label}>Password</Text>
                <View style={style.inputWrapper}>
                  <Feather name="lock" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="#9a9a9a" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-5">
                <Text style={style.label}>Confirm password</Text>
                <View style={style.inputWrapper}>
                  <Feather name="lock" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#9a9a9a"
                    style={[style.input, { flex: 1 }]}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Feather name={showConfirm ? "eye-off" : "eye"} size={16} color="#9a9a9a" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity style={style.button} activeOpacity={0.85}>
                <Text style={style.buttonText}>Create account</Text>
              </TouchableOpacity>
            </View>

            {/* Sign in link */}
            <View className="flex-row justify-center mt-5">
              <Text style={style.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={style.footerLink}>Sign in</Text>
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
    fontFamily: "Poppins-Medium",
    fontSize: 26,
    color: "#1a1a1a",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
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
  },
  label: {
    fontFamily: "Poppins-Medium",
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
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#2d2d2d",
    padding: 0,
  },
  button: {
    backgroundColor: "#6E8DE0",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#fff",
  },
  footerText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#3a3a3a",
  },
  footerLink: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#2a50a8",
  },
});

export default Register;