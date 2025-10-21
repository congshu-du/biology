import CEchart, { colorList } from "@/components/echart/Cechart";
import { PrefixStatistic } from "@/services/as/interface";
import { computed, defineComponent, watchEffect } from "vue";

const Ipv4Sort = defineComponent<{ data: PrefixStatistic[] }>(
  (props) => {
    const option = computed(() => {
      return {
        title: {
          text: "IPv4前缀统计(TOP5)",
          left: "center",
          top: "16px",
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
          data: props.data
            .slice(0, 5)
            .map((n) => n.prefixLength)
            .reverse(),
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: props.data
              .slice(0, 5)
              .map((n, i) => ({ value: n.prefixCount, itemStyle: { color: colorList[i % 5] } }))
              .reverse(),
          },
        ],
      };
    });

    return () => <CEchart class="h-full w-full" option={option.value} autoresize />;
  },
  { props: ["data"] },
);

export default Ipv4Sort;
