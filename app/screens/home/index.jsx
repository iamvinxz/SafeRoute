import AnnouncementCard from "@/components/AnnouncementCard";
import NotificationComponent from "@/components/NotificationComponent";
import { useGetAllAnnouncementQuery } from "@/redux/announcementService";
import { useGetAllArticlesQuery } from "@/redux/articleService";
import { useGetWeatherQuery } from "@/redux/weatherService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const rainyLogo = require("@/assets/images/rainy-logo.png");
const sunnyLogo = require("@/assets/images/sunny-logo.png");
const sunny = require("@/assets/images/cloud-blue-sky.jpg");
const rainy = require("@/assets/images/rainy-weather.jpg");
const relief = require("@/assets/images/relief.jpg");
const reminder = require("@/assets/images/reminder.png");
const sLogo = require("@/assets/images/saferoute-logo.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Home = () => {
  const [notificationCount, setNotificationCount] = useState(2);
  const [viewNotification, setViewNotification] = useState(false);
  const [coords, setCoords] = useState(null);

  //rtk query
  const { data: articlesData } = useGetAllArticlesQuery();
  const { data: announcementData } = useGetAllAnnouncementQuery();
  const { data: weatherData, isLoading: weatherLoading } = useGetWeatherQuery(
    coords,
    { skip: !coords },
  );
  const article = articlesData?.articles ?? [];
  const announcements = announcementData?.announcements ?? [];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.headerContainer}>
        <View style={style.headerContent}>
          <View style={style.logoContainer}>
            <Image source={sLogo} className="w-12 h-10" />
            <Text style={style.logoText}>Saferoute</Text>
          </View>

          {/* <TouchableOpacity
            className="mr-1"
            onPress={() => setViewNotification((notif) => !notif)}
          >
            <View className="relative">
              <Ionicons name="notifications-outline" size={24} color="black" />
              {notificationCount > 0 && (
                <View style={style.notification}>
                  <Text className="text-white text-xs font-bold">
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
      {viewNotification && <NotificationComponent />}
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
                    {weatherData?.location ?? "Fetching location..."}
                  </Text>
                </View>

                <Text style={style.temperature}>
                  {weatherData?.temperature != null
                    ? `${weatherData.temperature} °C`
                    : "--"}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Announcement Section */}
        <View className="mb-2 ml-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 5 }}
            contentContainerStyle={{ gap: 10, paddingRight: 16 }}
          >
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <AnnouncementCard
                  key={item._id}
                  title={item.title}
                  content={item.content}
                  author={item.sentBy?.name}
                  createdAt={item.createdAt}
                />
              ))
            ) : (
              <View style={style.fallbackContainer}>
                <Ionicons name="megaphone-outline" size={24} color="#b0b0b0" />
                <Text style={style.fallbackText}>No announcements yet</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/**article */}
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
              showsHorizontalScrollIndicator={false}
              style={style.article}
            >
              {/**articles map here */}
              {article
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) //sort for latest
                .map((article, _index) => (
                  <View key={article._id} style={style.articleCard}>
                    {article.photoUrl ? (
                      <View style={style.articleImage}>
                        <Text>image placeholder</Text>
                      </View>
                    ) : null}

                    <View style={style.articleInfo}>
                      <Text style={style.articleTitle}>{article.title}</Text>
                      <Text style={style.articleDescription}>
                        {article.description}
                      </Text>
                    </View>
                    <View style={style.footer}>
                      <Text style={style.createdAt}>
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )
                          : null}
                      </Text>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
        <View className="ml-4">
          <Text className="text-[1.1rem]" style={{ fontFamily: "Montserrat" }}>
            Things to remember
          </Text>
          <View style={style.reminderContainer}>
            <Image
              source={reminder}
              style={style.imageRemember}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fcfcfc",
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    overflow: "hidden",
    paddingBottom: 3,
  },
  headerContent: {
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
  },
  logoText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
    marginLeft: 12,
    marginTop: 6,
  },
  notification: {
    backgroundColor: "red",
    width: 16,
    height: 16,
    borderRadius: 8,
    position: "absolute",
    top: -4,
    right: -4,
    alignItems: "center",
    justifyContent: "center",
  },
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
    width: SCREEN_WIDTH - 32,
    marginLeft: 20,
    padding: 10,
  },
  article: {
    marginTop: 5,
    width: SCREEN_WIDTH - 32,
    display: "flex",
    gap: 20,
  },
  articleCard: {
    width: 200,
    height: 192,
    backgroundColor: "#e4e4e4",
    marginRight: 10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  articleImage: {
    backgroundColor: "white",
    height: 90,
    width: "100%",
    marginTop: 8,
    borderRadius: 4,
    alignSelf: "center",
    elevation: 2,
  },
  articleInfo: {
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 3,
  },
  articleTitle: {
    fontFamily: "Montserrat",
  },
  articleDescription: {
    fontFamily: "Montserrat",
    fontSize: 10,
  },
  createdAt: {
    fontFamily: "Montserrat",
    fontSize: 10,
    color: "#828181",
  },
  footer: {
    marginTop: "auto",
  },
  reminderContainer: {
    marginTop: 3,
    width: SCREEN_WIDTH - 32,
    borderRadius: 15,
    overflow: "hidden",
  },
  imageRemember: {
    width: "100%",
    height: 845,
    marginBottom: 100,
  },
  image: {
    width: SCREEN_WIDTH - 32,
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
    width: SCREEN_WIDTH - 32,
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
  fallbackContainer: {
    width: SCREEN_WIDTH - 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
  },
  fallbackText: {
    fontSize: 12,
    fontFamily: "Montserrat",
    color: "#b0b0b0",
  },
});

export default Home;
