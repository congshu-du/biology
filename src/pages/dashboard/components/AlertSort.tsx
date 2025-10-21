import { computed, defineComponent, ref } from "vue";
import CEchart, { colorList } from "@/components/echart/Cechart";
import { token } from "@/utils/theme";

const AlertSort = defineComponent<{ time?: string }>(
  () => {
    const loading = ref(false);

    const sources = ["张家口", "网络中心", "基因组所"];
    const downloads = ref<number[]>([1200.5, 1530.2, 980.3]);
    const latency = ref<number[]>([180, 170, 165]);
    const speed = ref<number[]>([25.1, 32.5, 22.7]);
    const loss = ref<number[]>([6, 5, 4]);

    const normalize = (arr: number[]) => {
      const max = Math.max(...arr, 1);
      return arr.map((v) => (v / max) * 100);
    };

    const option = computed(() => {
      const nd = normalize(downloads.value);
      const nl = normalize(latency.value);
      const ns = normalize(speed.value);
      const np = normalize(loss.value);

      return {
        title: {
          text: "国内下载分布 - 国内下载源总体统计",
          left: "center",
          top: 8,
          textStyle: { fontSize: 16, fontWeight: "bold" },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: function (params: any) {
            const idx = params[0].dataIndex;
            return `
            <div style="padding:8px; min-width:200px;">
              <div style="font-weight:700; margin-bottom:6px;">${sources[idx]}</div>
              <div style="font-size:12px; color:#444;">下载总量: <strong style="color:${colorList[0]};">${downloads.value[idx].toFixed(1)} GB</strong></div>
              <div style="font-size:12px; color:#444;">网络延迟: <strong style="color:${colorList[1]};">${latency.value[idx]} ms</strong></div>
              <div style="font-size:12px; color:#444;">下载速度: <strong style="color:${colorList[2]};">${speed.value[idx]} MB/s</strong></div>
              <div style="font-size:12px; color:#444;">丢包率: <strong style="color:${colorList[3]};">${loss.value[idx]}%</strong></div>
            </div>
          `;
          },
        },
        grid: { left: "20px", right: "20px", top: 80, bottom: 30 },
        xAxis: { type: "category", data: sources, axisLabel: { fontSize: 12 } },
        yAxis: {
          type: "value",
          name: "归一化值(0-100)",
          show: false,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
        legend: { top: 36, data: ["下载总量", "网络延迟", "下载速度", "丢包率"] },
        series: [
          {
            name: "下载总量",
            type: "bar",
            data: nd.map((v, i) => ({ value: v, raw: downloads.value[i], itemStyle: { color: colorList[0] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} GB` },
          },
          {
            name: "网络延迟",
            type: "bar",
            data: nl.map((v, i) => ({ value: v, raw: latency.value[i], itemStyle: { color: colorList[1] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} ms` },
          },
          {
            name: "下载速度",
            type: "bar",
            data: ns.map((v, i) => ({ value: v, raw: speed.value[i], itemStyle: { color: colorList[2] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} MB/s` },
          },
          {
            name: "丢包率",
            type: "bar",
            data: np.map((v, i) => ({ value: v, raw: loss.value[i], itemStyle: { color: colorList[3] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw}%` },
          },
        ],
        graphic: {
          invisible: downloads.value.length !== 0,
          type: "text",
          left: "center",
          top: "middle",
          style: { text: loading.value ? "加载中..." : "暂无数据", fontSize: 14, fill: token.colorTextQuaternary },
        },
      };
    });

    return () => <CEchart class="h-full w-full" option={option.value} autoresize />;
  },
  { props: ["time"] },
);

export default AlertSort;
