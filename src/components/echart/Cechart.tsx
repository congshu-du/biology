import Vchart from "vue-echarts";
import * as echarts from "echarts";
import maps from "./world.json";
import china from "echarts-map/json/china.json";
import { computed, FunctionalComponent } from "vue";
// import { ECBasicOption } from "echarts/types/dist/shared";
import customDark from "./customDark";
import { themeType, token } from "@/utils/theme";

type EchartsProps = InstanceType<typeof Vchart>["$props"];

echarts.registerTheme("customDark", customDark);
echarts.registerMap("world", maps as any);
echarts.registerMap("china", china as any);

export const colorList = [token.C1, token.C2, token.C3, token.C4, token.C5];

export const colorList2 = [token["red-7"], ...colorList];

const Cechart: FunctionalComponent<EchartsProps> = (props) => {
  const option = computed(() => ({
    textStyle: {
      fontFamily: "HYQiHei55J",
    },
    ...props.option,
    backgroundColor: "transparent",
  }));
  return <Vchart {...props} option={option.value} theme={themeType !== "light" ? "customDark" : "light"} autoresize />;
};

export default Cechart;
