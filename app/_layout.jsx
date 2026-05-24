import "@/global.css";
import { store } from "@/store.js";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import * as Notification from "expo-notifications";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

//notification channel
if (Platform.OS === "android") {
  Notification.setNotificationChannelAsync("flood_alerts", {
    name: "Flood Alerts",
    importance: Notification.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

// ✅ background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", remoteMessage);
});

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;
