import Entypo from "@expo/vector-icons/Entypo";
import { Text } from "@react-navigation/elements";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TabBar = ({ state, descriptors, navigation }) => {
  const primary = "#EDEDED";
  const secondary = "#8F8D8D";

  const icons = {
    index: (props) => (
      <Entypo name="home" size={24} color={secondary} {...props} />
    ),
    maps: (props) => (
      <View className="w-[90%] h-[7rem] bg-inherit rounded-[50%] absolute top-[-75]">
        <View
          className="bg-white h-[6rem] w-[85%] rounded-[50%] border-[#4A53CE] border-2 relative left-2 top-2"
          style={style.circleButton}
        >
          <Entypo
            name="location"
            size={30}
            color="#F14D29"
            className="self-center absolute top-7"
          />
        </View>
      </View>
    ),
    menu: (props) => (
      <Entypo name="menu" size={24} color={secondary} {...props} />
    ),
  };

  return (
    <View className="flex justify-center items-center">
      <View
        className="absolute bottom-11 w-[90%] h-[4.5rem] flex justify-center items-center  flex-row content-center bg-white text-black rounded-[1.8rem]"
        style={style.shadow}
      >
        {state.routes
          .filter((route) => icons[route.name])
          .map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                className="justify-center items-center gap-1"
                key={route.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
              >
                {icons[route.name]({
                  color: isFocused ? primary : secondary,
                })}
                <Text
                  style={{
                    color: isFocused ? primary : secondary,
                    fontSize: 9,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
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
  circleButton: {
    shadowColor: "#3f74e7",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.24,
    shadowRadius: 15.38,
    elevation: 19,
  },
});

export default TabBar;
