import { computed, defineComponent, ref } from "vue";
import CEchart, { colorList } from "@/components/echart/Cechart";
import { token } from "@/utils/theme";
import { Select } from "ant-design-vue";

interface DownloadPoint {
  name: string;
  ip?: string;
  totalDownload?: number; // GB
  latency?: number; // ms
  speed?: number; // MB/s
  packetLoss?: number; // fraction (0-1)
}

// 从 WorldMap 的 download series 中提取的国内下载点（如果需要可改为从接口/prop 引入）
const defaultDownloadPoints: DownloadPoint[] = [
  { name: "北京下载点", ip: "202.106.0.20", totalDownload: 106.4, latency: 180, speed: 25.1, packetLoss: 0.05 },
  { name: "上海下载点", ip: "202.127.0.25", totalDownload: 135.9, latency: 175, speed: 32.5, packetLoss: 0.04 },
  { name: "广州下载点", ip: "202.116.0.18", totalDownload: 88.8, latency: 190, speed: 20.8, packetLoss: 0.06 },
  { name: "深圳下载点", ip: "202.104.0.22", totalDownload: 67.8, latency: 195, speed: 18.2, packetLoss: 0.08 },
  { name: "成都下载点", ip: "202.115.0.15", totalDownload: 61.3, latency: 210, speed: 15.4, packetLoss: 0.12 },
  { name: "杭州下载点", ip: "202.108.0.28", totalDownload: 80.9, latency: 172, speed: 26.3, packetLoss: 0.05 },
  { name: "武汉下载点", ip: "202.114.0.19", totalDownload: 70.3, latency: 185, speed: 23.8, packetLoss: 0.08 },
  { name: "西安下载点", ip: "202.117.0.16", totalDownload: 57.5, latency: 195, speed: 16.7, packetLoss: 0.1 },
];

// EMBL-EBI 下载源数据（欧洲生物信息学研究所）
const embldownloadPoints: DownloadPoint[] = [
  { name: "北京下载点", ip: "202.106.0.20", totalDownload: 95.2, latency: 220, speed: 18.7, packetLoss: 0.08 },
  { name: "上海下载点", ip: "202.127.0.25", totalDownload: 142.3, latency: 195, speed: 28.9, packetLoss: 0.06 },
  { name: "广州下载点", ip: "202.116.0.18", totalDownload: 76.5, latency: 235, speed: 17.2, packetLoss: 0.09 },
  { name: "深圳下载点", ip: "202.104.0.22", totalDownload: 72.1, latency: 240, speed: 16.5, packetLoss: 0.11 },
  { name: "成都下载点", ip: "202.115.0.15", totalDownload: 55.8, latency: 260, speed: 13.2, packetLoss: 0.15 },
  { name: "杭州下载点", ip: "202.108.0.28", totalDownload: 88.6, latency: 190, speed: 22.8, packetLoss: 0.08 },
  { name: "武汉下载点", ip: "202.114.0.19", totalDownload: 65.4, latency: 215, speed: 19.5, packetLoss: 0.1 },
  { name: "西安下载点", ip: "202.117.0.16", totalDownload: 52.3, latency: 230, speed: 14.1, packetLoss: 0.13 },
];

// DDBJ 下载源数据（日本生物信息学中心）
const ddbjDownloadPoints: DownloadPoint[] = [
  { name: "北京下载点", ip: "202.106.0.20", totalDownload: 88.7, latency: 165, speed: 30.2, packetLoss: 0.04 },
  { name: "上海下载点", ip: "202.127.0.25", totalDownload: 128.4, latency: 150, speed: 35.8, packetLoss: 0.03 },
  { name: "广州下载点", ip: "202.116.0.18", totalDownload: 82.6, latency: 175, speed: 24.7, packetLoss: 0.05 },
  { name: "深圳下载点", ip: "202.104.0.22", totalDownload: 63.9, latency: 180, speed: 22.1, packetLoss: 0.06 },
  { name: "成都下载点", ip: "202.115.0.15", totalDownload: 58.2, latency: 195, speed: 18.9, packetLoss: 0.09 },
  { name: "杭州下载点", ip: "202.108.0.28", totalDownload: 75.3, latency: 145, speed: 31.5, packetLoss: 0.04 },
  { name: "武汉下载点", ip: "202.114.0.19", totalDownload: 68.7, latency: 160, speed: 27.6, packetLoss: 0.04 },
  { name: "西安下载点", ip: "202.117.0.16", totalDownload: 54.8, latency: 170, speed: 20.3, packetLoss: 0.08 },
];

const DownloadSort = defineComponent<{ time?: string }>(
  () => {
    const loading = ref(false);
    const list = ref<DownloadPoint[]>([]);
    const currentDownloadOrigin = ref<string>("NCBI");

    const handleDownloadOriginChange = (value: any) => {
      currentDownloadOrigin.value = value;
      loadData();
    };

    const loadData = () => {
      loading.value = true;
      setTimeout(() => {
        // 根据当前选择的下载源加载对应的数据
        switch (currentDownloadOrigin.value) {
          case "EMBL-EBI":
            list.value = embldownloadPoints.slice();
            break;
          case "DDBJ":
            list.value = ddbjDownloadPoints.slice();
            break;
          case "NCBI":
          default:
            list.value = defaultDownloadPoints.slice();
            break;
        }
        loading.value = false;
      }, 200);
    };

    loadData();

    // 归一化函数：把每个指标缩放到 0-100 便于并列显示，但 tooltip 显示原始值
    const normalize = (arr: number[]) => {
      const max = Math.max(...arr, 1);
      return arr.map((v) => (v / max) * 100);
    };

    const option = computed(() => {
      // 现在 x 轴是类别（下载点），y 轴为数值（归一化 0-100）
      const names = list.value.map((p) => p.name);

      // 收集原始数组用于归一化
      const downloads = list.value.map((p) => p.totalDownload ?? 0);
      const latencies = list.value.map((p) => p.latency ?? 0);
      const speeds = list.value.map((p) => p.speed ?? 0);
      const losses = list.value.map((p) => (p.packetLoss ?? 0) * 100); // 转为百分比

      const nd = normalize(downloads);
      const nl = normalize(latencies);
      const ns = normalize(speeds);
      const np = normalize(losses);

      return {
        title: {
          text: `${currentDownloadOrigin.value} 下载分布（国内下载点对比）`,
          left: "center",
          top: 8,
          textStyle: { fontSize: 16, fontWeight: "bold" },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: function (params: any) {
            // params 为不同 series 的数组，按顺序：下载, 延迟, 速度, 丢包
            const idx = params[0].dataIndex;
            const p = list.value[idx];
            return `
              <div style="padding:8px; min-width:200px;">
                <div style="font-weight:700; margin-bottom:6px;">${p?.name}</div>
                <div style="font-size:12px; color:#444;">下载总量: <strong style="color:#16a34a;">${p?.totalDownload ?? "-"} GB</strong></div>
                <div style="font-size:12px; color:#444;">网络延迟: <strong style="color:#059669;">${p?.latency ?? "-"} ms</strong></div>
                <div style="font-size:12px; color:#444;">下载速度: <strong style="color:#ea580c;">${p?.speed ?? "-"} MB/s</strong></div>
                <div style="font-size:12px; color:#444;">丢包率: <strong style="color:#7c3aed;">${p?.packetLoss != null ? (p.packetLoss * 100).toFixed(2) + "%" : "-"}</strong></div>
              </div>
            `;
          },
        },
        grid: { left: "20px", right: "20px", top: 80, bottom: 30 },
        xAxis: { type: "category", data: names, axisLabel: { fontSize: 12, rotate: 0 } },
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
            data: nd.map((v, i) => ({ value: v, raw: downloads[i], itemStyle: { color: colorList[0] } })),
            barGap: 0,
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} GB`, fontSize: 11 },
          },
          {
            name: "网络延迟",
            type: "bar",
            data: nl.map((v, i) => ({ value: v, raw: latencies[i], itemStyle: { color: colorList[1] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} ms`, fontSize: 11 },
          },
          {
            name: "下载速度",
            type: "bar",
            data: ns.map((v, i) => ({ value: v, raw: speeds[i], itemStyle: { color: colorList[2] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw} MB/s`, fontSize: 11 },
          },
          {
            name: "丢包率",
            type: "bar",
            data: np.map((v, i) => ({ value: v, raw: losses[i], itemStyle: { color: colorList[3] } })),
            label: { show: true, position: "top", formatter: (p: any) => `${p.data.raw}%`, fontSize: 11 },
          },
        ],
        graphic: {
          invisible: list.value.length !== 0,
          type: "text",
          left: "center",
          top: "middle",
          style: { text: loading.value ? "加载中..." : "暂无数据", fontSize: 14, fill: token.colorTextQuaternary },
        },
      };
    });

    return () => (
      <div class="h-full w-full relative">
        <div class="absolute top-4 right-4 z-10">
          <Select
            class="!w-52"
            value={currentDownloadOrigin.value}
            onChange={handleDownloadOriginChange}
            options={[
              { label: "NCBI（美国国家生物技术信息中心）", value: "NCBI" },
              { label: "EMBL-EBI（EMBL 的欧洲生物信息学研究所）", value: "EMBL-EBI" },
              { label: "DDBJ（生物信息与 DDBJ 中心）", value: "DDBJ" },
            ]}
          />
        </div>
        <CEchart class="h-full w-full" option={option.value} autoresize />
      </div>
    );
  },
  { props: ["time"] },
);

export default DownloadSort;
