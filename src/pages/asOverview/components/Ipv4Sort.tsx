import CEchart from "@/components/echart/Cechart";
import { computed, defineComponent } from "vue";

const Ipv4Sort = defineComponent(() => {
  // PrefixStatistic
  const option = computed(() => ({
    title: {
      text: "ipv4前缀统计",
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
      data: ["24", "22", "23", "21", "20"],
    },
    series: [
      {
        name: "2011",
        type: "bar",
        data: [18203, 23489, 29034, 104970, 131744],
      },
    ],
  }));

  return () => <CEchart class="h-full w-full" option={option.value} autoresize />;
});

export default Ipv4Sort;
