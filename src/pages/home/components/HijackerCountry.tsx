import { getTimestampArr } from "@/components/datePicker/config";
import CEchart, { colorList } from "@/components/echart/Cechart";
import { getAlertEconomyregionCountStatistic } from "@/services/alert";
import { computed, defineComponent, ref, watchEffect } from "vue";
import { countryNameMap } from "@/assets/data/contry";
import { token } from "@/utils/theme";

const HijackerCountry = defineComponent<{ time: string }>(
  (props) => {
    const loading = ref(false);
    const data = ref<{ name: string; count: number }[]>([]);

    watchEffect(async () => {
      try {
        loading.value = true;
        const timestamp = getTimestampArr(props.time);
        const res = await getAlertEconomyregionCountStatistic({
          searchStartTime: timestamp![0],
          searchEndTime: timestamp![1],
          role: "ATTACKER",
        });

        if (res.code !== 200) {
          throw new Error();
        }
        data.value = res.data
          .filter((n) => !!n.economyRegion)
          .map((n) => ({
            name: countryNameMap[n.economyRegion] ?? n.economyRegion,
            count: n.count,
          }))
          .slice(0, 20);
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    });
    // getAlertEconomyregionCountStatistic
    const option = computed(() => ({
      title: {
        text: "劫持者国家/地区统计",
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
        type: "category",
        show: data.value.length > 0,
        data: data.value.map((n) => n.name),
      },
      yAxis: {
        show: data.value.length > 0,
        type: "value",
      },
      graphic: {
        invisible: data.value.length !== 0,
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: loading.value ? "加载中..." : "暂无数据",
          fontSize: 14,
          fill: token.colorTextQuaternary,
        },
      },
      series: [
        {
          data: data.value.map((n, i) => ({ value: n.count, itemStyle: { color: colorList[i % 5] } })),
          type: "bar",
          name: "数量",
        },
      ],
    }));
    return () => <CEchart class="h-full w-full" option={option.value} autoresize />;
  },
  { props: ["time"] },
);

export default HijackerCountry;
