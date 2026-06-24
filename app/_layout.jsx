import "@/global.css";
import { login } from "@/states/authSlice";
import { store } from "@/store.js";
import { getToken, getUser } from "@/utils/authStorage";
import messaging from "@react-native-firebase/messaging";
import { useFonts } from "expo-font";
import * as Notification from "expo-notifications";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", remoteMessage);
});

const AppInit = () => {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        if (token) {
          dispatch(login({ token, user }));
        }
      } catch (e) {
        console.error("Failed to restore auth:", e);
      } finally {
        setAuthReady(true);
      }
    };

    restoreAuth();
  }, []);

  if (!authReady) return null; // wait before rendering anything

  return <Slot />;
};

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
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
        <AppInit />
      </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;
