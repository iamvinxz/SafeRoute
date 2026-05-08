import { logout } from "@/states/authSlice";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const data = [
  {
    description:
      "The app is for emergency alerts and assistance only and does not guarantee immediate rescue. Use the app responsibly false reports or misuse are strictly prohibited",
  },
  {
    description:
      "Use the app responsibly—false reports or misuse are strictly prohibited.",
  },
  {
    description:
      "You agree to share accurate information, including your location, for emergency response.",
  },
  {
    description:
      "We are not liable for delays, errors, or damages caused by network or system issues.",
  },
  {
    description:
      "Services may be temporarily unavailable due to maintenance or technical problems.",
  },
  {
    description:
      "We may update these terms at any time, and continued use means acceptance.",
  },
];

const Menu = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView className="px-4 py-2">
      <Text
        className="text-[1.2rem] mt-5"
        style={{ fontFamily: "Montserrat-Bold" }}
      >
        Account Details
      </Text>
      <View className="w-[99%] bg-[#17537E] mt-4 self-center rounded-xl">
        <View className="p-5">
          <View className="flex-row gap-10 w-full">
            <View>
              <Text style={style.font}>Phone Number: </Text>
              <Text style={style.font}>Location: </Text>
            </View>
            {/**profile info */}
            <View>
              <Text style={style.font}>09123456789</Text>
              <Text style={style.font}>Malabon City</Text>
            </View>
          </View>
        </View>
      </View>

      <View>
        <Text
          className="text-[1.1rem] mt-5 text-[#5d5d5d]"
          style={{ fontFamily: "Montserrat-Bold" }}
        >
          Terms & Conditions
        </Text>
        <Text
          className="text-[0.9rem] mt-2 text-[#5d5d5d]"
          style={{ fontFamily: "Montserrat" }}
        >
          By using this app, you agree to the following:
        </Text>
        {data.map((item, index) => (
          <View key={index} className="flex-row mb-3 pr-4">
            <Text className="text-[#5d5d5d] mr-2">.</Text>
            <Text
              className="text-[0.85rem] text-[#6d6d6d] leading-5"
              style={{ fontFamily: "Montserrat" }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        className="flex flex-row items-center mt-6 justify-center"
        onPress={() => dispatch(logout())}
      >
        <View
          style={style.logout}
          className="flex flex-row items-center justify-center py-4 rounded-xl bg-red-500"
        >
          <Text className="text-white" style={{ fontFamily: "Montserrat" }}>
            Logout
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  logout: {
    width: 300,
  },
  font: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "white",
    paddingVertical: 5,
  },
});

export default Menu;
