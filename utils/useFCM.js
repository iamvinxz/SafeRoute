import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useFCM = () => {
  useEffect(() => {
    const setup = async () => {
      // request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log("Notification permission denied");
        return;
      }

      // get FCM token
      const token = await messaging().getToken();
      console.log("FCM Token:", token);

      // subscribe to resident_alerts topic
      await messaging().subscribeToTopic("users");
      console.log("Subscribed to users topic");
    };

    setup();

    // handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground notification:", remoteMessage);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          sound: true,
        },
        trigger: null,
      });
    });

    return unsubscribe;
  }, []);
};
