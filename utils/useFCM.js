import { useUpdateFCMTokenMutation } from "@/redux/fcmService";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export const useFCM = () => {
  //rtk
  const [updateFCMToken] = useUpdateFCMTokenMutation();

  useEffect(() => {
    const setup = async () => {
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("flood_alerts", {
            name: "Flood Alerts",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
            enableVibrate: true,
          });
        }

        let permissions = await Notifications.getPermissionsAsync();

        if (!permissions.granted && permissions.canAskAgain) {
          permissions = await Notifications.requestPermissionsAsync();
        }

        if (!permissions.granted) {
          console.log("Notification permission denied");
          return;
        }

        const token = await messaging().getToken();
        await updateFCMToken(token);

        await messaging().subscribeToTopic("users");
        await messaging().subscribeToTopic("flood_alerts");
        await messaging().subscribeToTopic("sos_status_update");
      } catch (e) {
        console.error("Setup crashed:", e);
      }
    };

    setup();

    // handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      try {
        //display notification on foreground
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            sound: true,
            data: remoteMessage.data ?? {},
            ...(Platform.OS === "android" && { channelId: "flood_alerts" }),
          },
          trigger: null,
        });
      } catch (error) {
        console.error(error);
      }
    });

    return unsubscribe;
  }, []);
};
