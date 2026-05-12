import { StyleSheet, Text, View } from "react-native";

const NotificationComponent = () => {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.title}>Notification</Text>
      </View>
      <View style={style.noContent}>
        <Text style={style.text}>Empty notification.</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    top: 100,
    right: 25,
    width: 300,
    height: 500,
    zIndex: 1,
    borderRadius: 10,
    overflow: "scroll",
    elevation: 8,
  },
  header: {
    borderBlockEndColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 0.3,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#303030",
  },
  noContent: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingBottom: 30,
  },
  text: {
    color: "gray",
    fontSize: 13,
  },
});

export default NotificationComponent;
