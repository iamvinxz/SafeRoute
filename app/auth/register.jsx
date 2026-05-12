import { useRegisterMutation } from "@/redux/authService";
import {
  clearRegister,
  setAge,
  setIsPwd,
  setPassword,
  setPhone,
} from "@/states/registerSlice";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { age, phone, password, isPwd } = useSelector(
    (state) => state.register,
  );

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    try {
      await register({
        age,
        phone,
        password,
        isPwd,
      }).unwrap();

      console.log("Registered successfuly");
    } catch (error) {
      console.error(error);
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
            <View className="items-center mb-7">
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
                    onChangeText={(text) => dispatch(setAge(text))}
                  />
                </View>
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text style={style.label}>Phone</Text>
                <View style={style.inputWrapper}>
                  <Feather name="phone" size={16} color="#6b6b6b" />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9a9a9a"
                    style={style.input}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    value={phone}
                    onChangeText={(text) => dispatch(setPhone(text))}
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
                    onChangeText={(text) => dispatch(setPassword(text))}
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
                    onChangeText={setConfirmPassword}
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
                  {/* Yes */}
                  <TouchableOpacity
                    style={style.radioOption}
                    onPress={() => dispatch(setIsPwd(true))}
                  >
                    <View style={style.radioOuter}>
                      {isPwd === true && <View style={style.radioInner} />}
                    </View>
                    <Text style={style.radioLabel}>Yes</Text>
                  </TouchableOpacity>

                  {/* No */}
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

              {/* Button */}
              <View style={style.buttonCtn}>
                <TouchableOpacity
                  style={style.button}
                  activeOpacity={0.85}
                  onPress={handleRegister}
                >
                  <Text style={style.buttonText}>Create account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.clearBtn}
                  onPress={() => dispatch(clearRegister())}
                >
                  <Text style={style.clearBtnText} activeOpacity={0.85}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign in link */}
            <View className="flex-row justify-center mt-5">
              <Text style={style.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("auth/login")}>
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
  buttonCtn: {
    gap: 10,
  },
  button: {
    backgroundColor: "#6E8DE0",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
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
});

export default Register;
