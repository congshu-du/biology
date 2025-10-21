import Cechart from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import { computed, defineComponent } from "vue";

const PeerBar = defineComponent<{ type: "IPv4" | "IPv6"; list: any[] }>(
  (props) => {
    const option = computed(() => {
      const { type, list } = props;
      const data = list.filter((item) => item.category === "peer");
      data.sort((a, b) => b.degree - a.degree);
      const lastData = data.slice(0, 5);
      return {
        title: {
          text: `${type} Peer排行榜`,
          left: "center",
          top: "8px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        // legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: lastData.map((item) => `AS${item.name}`).reverse(),
        },
        series: [
          {
            name: "数量",
            type: "bar",
            itemStyle: { color: token.C2 },
            data: lastData.map((item) => `${item.degree}`).reverse(),
          },
        ],
      };
    });
    return () => <Cechart class="h-full w-full" option={option.value} autoresize />;
  },
  { props: ["type", "list"] },
);

export default PeerBar;
