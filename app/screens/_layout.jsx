import CreateFloodReport from "@/components/CreateFloodReport";
import TabBar from "@/components/TabBar";
import { api } from "@/redux/APIService";
import { setSosAlert } from "@/states/sosAlertSlice";
import { useFCM } from "@/utils/useFCM";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ScreensLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.modal);

  useFCM();

  useEffect(() => {
    const restoreSosState = async () => {
      try {
        if (!token) return;
        const stored = await AsyncStorage.getItem("activeSos");

        if (!stored) return;

        const { sosId } = JSON.parse(stored);

        const data = await dispatch(
          api.endpoints.getSosById.initiate(sosId),
        ).unwrap();

        if (data.sos.status !== "resolved" && data.sos.status !== "cancelled") {
          dispatch(setSosAlert({ sosId, status: data.sos.status }));
          await AsyncStorage.setItem(
            "activeSos",
            JSON.stringify({ sosId, status: data.sos.status }),
          );
        } else {
          await AsyncStorage.removeItem("activeSos");
        }
      } catch (e) {
        console.error("Failed to restore SOS state:", e);
        await AsyncStorage.removeItem("activeSos");
      }
    };

    restoreSosState();
  }, [token]);

  if (!isAuthenticated || !token) {
    //todo: validate the token expiry
    return <Redirect href="/auth/login" />;
  }

  return (
    <View style={style.container}>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{ title: "Home", headerShown: false }}
        />
        <Tabs.Screen
          name="maps/maps"
          options={{ title: "Maps", headerShown: false }}
        />
        <Tabs.Screen
          name="menu/menu"
          options={{ title: "Menu", headerShown: false }}
        />
      </Tabs>

      {isOpen && <CreateFloodReport />}
    </View>
  );
};

export default ScreensLayout;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
