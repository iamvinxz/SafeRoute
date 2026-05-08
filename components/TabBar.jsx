import {
  getHumpPath,
  HUMP_HEIGHT,
  TAB_BAR_HEIGHT,
} from "@/components/tabBarPath";
import { Entypo } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const primary = "#0c47ef";
const secondary = "#8F8D8D";

const icons = {
  "home/index": (color) => <Entypo name="home" size={22} color={color} />,
  "maps/maps": (color) => <Entypo name="location" size={22} color={color} />,
  "menu/menu": (color) => <Entypo name="menu" size={22} color={color} />,
};

const TabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const filteredRoutes = state.routes.filter((r) => icons[r.name]);
  const selectedIndex = Math.max(
    0,
    filteredRoutes.findIndex((r) => r.key === state.routes[state.index]?.key),
  );

  const totalHeight = TAB_BAR_HEIGHT + HUMP_HEIGHT + insets.bottom;
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: totalHeight,
        position: "absolute",
        bottom: 0,
        backgroundColor: "transparent",
      }}
      pointerEvents="box-none"
    >
      {/* SVG hump background */}
      <Svg
        width={SCREEN_WIDTH}
        height={TAB_BAR_HEIGHT + HUMP_HEIGHT}
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={getHumpPath(selectedIndex, filteredRoutes.length, totalHeight)}
          fill="#F5F5F5"
          stroke="#e0e0e0"
          strokeWidth="1"
        />
      </Svg>

      {/* Tab buttons */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: insets.bottom,
          height: TAB_BAR_HEIGHT,
          width: "100%",
        }}
      >
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = selectedIndex === index;
          const color = isFocused ? primary : secondary;

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
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: isFocused ? HUMP_HEIGHT : 0,
                gap: 3,
              }}
            >
              {icons[route.name](color)}
              <Text style={{ fontSize: 9, color }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
