import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const TAB_BAR_HEIGHT = 65;
export const HUMP_HEIGHT = 20;

export const getHumpPath = (selectedIndex, tabCount, totalHeight) => {
  // Guard against invalid inputs
  if (!tabCount || tabCount <= 0 || selectedIndex < 0) {
    return `M0,${HUMP_HEIGHT}L${SCREEN_WIDTH},${HUMP_HEIGHT}L${SCREEN_WIDTH},${totalHeight ?? TAB_BAR_HEIGHT}L0,${totalHeight ?? TAB_BAR_HEIGHT}Z`;
  }

  const tabW = SCREEN_WIDTH / tabCount;
  const cx = tabW * selectedIndex + tabW / 2;
  const hw = 30;
  const H = totalHeight ?? TAB_BAR_HEIGHT;
  const W = SCREEN_WIDTH;

  return `
  M0,${HUMP_HEIGHT}
  L${cx - hw - 20},${HUMP_HEIGHT}
  C${cx - hw},${HUMP_HEIGHT} ${cx - hw * 1},0 ${cx},0
  C${cx + hw * 1},0 ${cx + hw},${HUMP_HEIGHT} ${cx + hw + 20},${HUMP_HEIGHT}
  L${W},${HUMP_HEIGHT}
  L${W},${H}
  L0,${H}
  Z
`;
};
