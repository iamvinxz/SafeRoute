import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const rainyLogo = require("../assets/images/rainy-logo.png");
const sunnyLogo = require("../assets/images/sunny-logo.png");
const sunny = require("../assets/images/cloud-blue-sky.jpg");
const rainy = require("../assets/images/rainy-weather.jpg");
const relief = require("../assets/images/relief.jpg");
const reminder = require("../assets/images/reminder.png");
const sLogo = require("../assets/images/saferoute-logo.png");
const Home = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  return (
    <SafeAreaView className="bg-white w-full h-full">
      <View style={{ overflow: "hidden", paddingBottom: 3 }}>
        <View
          className="py-3 bg-white px-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Image source={sLogo} className="w-12 h-10" />
            <Text
              style={{ fontFamily: "Montserrat-Bold", fontSize: 17 }}
              className="ml-4 mt-1.5"
            >
              Saferoute
            </Text>
          </View>

          <TouchableOpacity
            className="mr-1"
            onPress={() => console.log("bell pressed")}
          >
            <View className="relative">
              <Ionicons name="notifications-outline" size={24} color="black" />
              {notificationCount > 0 && (
                <View className="bg-red-600 w-4 h-4 rounded-full absolute -top-1 -right-1 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView vertical showsHorizontalScrollIndicator={false}>
        <TouchableOpacity className="mb-3 mt-3">
          <ImageBackground source={sunny} style={style.image}>
            <LinearGradient
              className="absolute"
              style={StyleSheet.absoluteFill}
              colors={["rgba(0,0,0, 0.5)", "rgba(0,0,0, 0.5)"]}
            >
              <View className="flex flex-row justify-between items-center p-3 px-5">
                <View>
                  <Text
                    className="text-[1.1rem] color-white shadow-black"
                    style={{ fontFamily: "Montserrat-Bold" }}
                  >
                    Weather Today
                  </Text>
                  <Text
                    className="text-white"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    Wednesday
                  </Text>
                </View>

                <Text style={style.temperature}>33 °C</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <View className="mb-5">
          <ImageBackground source={relief} style={style.image2}>
            <LinearGradient
              className="absolute"
              style={StyleSheet.absoluteFill}
              colors={["rgba(0,0,0, 0.5)", "rgba(0,0,0, 0.5)"]}
            >
              <View className="flex flex-row justify-between items-center p-3 px-5">
                <View>
                  <Text
                    className="text-[0.85rem] mt-4 color-white w-12.3 shadow-black"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    Together for relief,
                  </Text>
                  <Text
                    className="text-[0.85rem] color-white w-12.3 shadow-black"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    Stronger in Recovery
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View className="mb-5 ml-4">
          <Text className="text-[1.1rem]" style={{ fontFamily: "Montserrat" }}>
            Latest Updates
          </Text>
          <Text className="text-[0.75rem]" style={{ fontFamily: "Montserrat" }}>
            Stay updated during flood emergencies—get real-time alerts, safety
            info, and rescue updates to keep you and your loved ones safe.
          </Text>

          <View>
            <ScrollView
              horizontal
              className="mt-2"
              showsHorizontalScrollIndicator={false}
            >
              <View className="w-[14rem] bg-red-600 mr-5 h-[12rem] rounded-xl">
                <Text></Text>
              </View>

              <View className="w-[14rem] bg-[rgba(31,29,29,0.43)] mr-5 h-[12rem] rounded-xl">
                <Text></Text>
              </View>

              <View className="w-[14rem] bg-[rgba(63,63,63,0.43)] mr-5 h-[12rem] rounded-xl">
                <Text></Text>
              </View>

              <View className="w-[14rem] bg-[rgba(66,62,62,0.43)] mr-5 h-[12rem] rounded-xl">
                <Text></Text>
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="ml-4">
          <Text className="text-[1.1rem] " style={{ fontFamily: "Montserrat" }}>
            Things to remember
          </Text>
          <View>
            <Image source={reminder} style={style.imageRemember} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.24,
    shadowRadius: 15.38,
    elevation: 19,
  },
  announcement: {
    width: 330,
    marginLeft: 20,
    padding: 10,
  },
  imageRemember: {
    width: 360,
    height: 1000,
    borderRadius: 15,
    marginBottom: 100,
  },
  image: {
    width: 360,
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.24,
    shadowRadius: 15.38,
    elevation: 19,
  },
  image2: {
    width: 360,
    height: 85,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.24,
    shadowRadius: 15.38,
    elevation: 19,
  },
  location: {
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    color: "#393636",
  },
  temperature: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "white",
  },
  weather: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    color: "#393636",
  },
  weatherImage: {
    width: 30,
    height: 20,
  },
  forecastImage: {
    width: 40,
    height: 30,
  },
  forecastFont: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
});

export default Home;
