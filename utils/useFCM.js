import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

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
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: "flood_alerts",
          pressAction: { id: "default" },
          importance: AndroidImportance.HIGH,
        },
      });
    });

    return unsubscribe;
  }, []);
};
