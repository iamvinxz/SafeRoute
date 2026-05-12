import CreateFloodReport from "@/components/CreateFloodReport";
import TabBar from "@/components/TabBar";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

const ScreensLayout = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.modal);

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
