import { getTimestampArr } from "@/components/datePicker/config";
import CEchart, { colorList } from "@/components/echart/Cechart";
import { getAlertIprefixStatistic } from "@/services/alert";
import { token } from "@/utils/theme";
import { computed, defineComponent, ref, watchEffect } from "vue";

const Ipv4Sort = defineComponent<{ time: string }>(
  (props) => {
    const list = ref<{ prefixLength: number; count: number }[]>([]);
    const loading = ref(false);

    watchEffect(async () => {
      try {
        loading.value = true;
        const timestamp = getTimestampArr(props.time);
        const res = await getAlertIprefixStatistic({
          searchStartTime: timestamp![0],
          searchEndTime: timestamp![1],
        });
        if (res.code !== 200) {
          throw new Error();
        }
        const data = res.data.find((n) => n.ipType === 4)?.ipPrefixCountList || [];
        list.value = data.slice(0, 5);
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    });
    const option = computed(() => ({
      title: {
        text: "被劫持者IPv4前缀统计",
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
        show: list.value.length > 0,
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        show: list.value.length > 0,
        type: "category",
        data: list.value.map((n) => `${n.prefixLength}`).reverse(),
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: list.value.map((n, i) => ({ value: n.count, itemStyle: { color: colorList[i % 5] } })).reverse(),
          // data: list.value.map((n) => n.count).reverse(),
        },
      ],
      graphic: {
        invisible: list.value.length !== 0,
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: loading.value ? "加载中..." : "暂无数据",
          fontSize: 14,
          fill: token.colorTextQuaternary,
        },
      },
    }));
    return () => <CEchart class="h-full w-full" option={option.value} autoresize />;
  },
  { props: ["time"] },
);

export default Ipv4Sort;
