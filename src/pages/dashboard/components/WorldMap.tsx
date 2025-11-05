import { defineComponent } from "vue";
import Cechart from "@/components/echart/Cechart";
import { Card } from "ant-design-vue";

interface WorldMapProps {
  time?: string;
}

const WorldMap = defineComponent<WorldMapProps>((props) => {
  // 世界地图配置
  const worldMapOption = {
    title: {
      text: "国际网络探测情况",
      left: "center",
      top: "0",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.seriesType === "lines") {
          const [latency, jitter, packetLoss] = params.value;
          return `
            <div style="padding: 8px; min-width: 200px;">
              <strong style="color: #333; font-size: 14px;">${params.name}</strong>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background: #fef3c7; color: #ea580c; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">下载速度</div>
                <div style="font-weight: bold; font-size: 16px;">${jitter} MB/s</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background: #d1fae5; color: #059669; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">网络延迟</div>
                <div style="font-weight: bold; font-size: 16px;">${latency} ms</div>
                </div>
                <div style="flex: 1; background: #ede9fe; color: #7c3aed; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">丢包率</div>
                <div style="font-weight: bold; font-size: 16px;">${(packetLoss * 100).toFixed(2)}%</div>
                </div>
              </div>
              </div>
            </div>
            `;
        } else if (params.seriesType === "scatter") {
          return `${params.name}<br/>坐标: ${params.value}`;
        }
        return `${params.name}`;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontSize: 12,
      },
      extraCssText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 6px;",
    },
    // 缩小四周空白，给地图更多显示空间

    geo: [
      {
        // 增加 geo 的百分比边距，让地图在容器中占比更大
        // left: "16px",
        // right: "16px",
        top: "40px",
        bottom: "16px",
        map: "world",
        roam: false, // 允许缩放和平移
        label: {
          emphasis: {
            show: false,
          },
        },
        scaleLimit: {
          min: 0.8,
          max: 5,
        },
        itemStyle: {
          color: "#E8F4FD",
          borderColor: "#B8D9F5",
          areaColor: "#E8F4FD",
        },
        emphasis: {
          disabled: true,
        },
      },
    ],
    // 用三组 series：origin（源）、download（下载点）、lines（连线）
    series: [
      {
        // lines：把每个下载点连到对应的 origin（coords: [from, to]）
        type: "lines",
        name: "download-lines",
        coordinateSystem: "geo",
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.2,
          symbol: "arrow",
          symbolSize: 5,
          color: "rgba(168, 85, 247, 0.6)", // 紫色箭头
        },
        lineStyle: {
          color: "rgba(168, 85, 247, 0.15)", // 淡紫色
          width: 1,
          curveness: 0.1,
        },
        data: [
          // 三个源连到北京下载点
          {
            name: "NCBI→北京",
            coords: [
              [-77.09, 38.98], // NCBI
              [116.4, 39.9], // 北京
            ],
            value: [180, 25.1, 0.05], // 延迟ms, 下载速度MB/s, 丢包率%
          },
          {
            name: "EMBL-EBI→北京",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [116.4, 39.9], // 北京
            ],
            value: [165, 28.3, 0.03],
          },
          {
            name: "DDBJ→北京",
            coords: [
              [138.91, 35.13], // DDBJ
              [116.4, 39.9], // 北京
            ],
            value: [145, 22.7, 0.08],
          },
          // 三个源连到上海下载点
          {
            name: "NCBI→上海",
            coords: [
              [-77.09, 38.98], // NCBI
              [121.47, 31.23], // 上海
            ],
            value: [175, 32.5, 0.04],
          },
          {
            name: "EMBL-EBI→上海",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [121.47, 31.23], // 上海
            ],
            value: [155, 35.8, 0.02],
          },
          {
            name: "DDBJ→上海",
            coords: [
              [138.91, 35.13], // DDBJ
              [121.47, 31.23], // 上海
            ],
            value: [140, 30.2, 0.06],
          },
          // 三个源连到广州下载点
          {
            name: "NCBI→广州",
            coords: [
              [-77.09, 38.98], // NCBI
              [113.23, 23.16], // 广州
            ],
            value: [190, 20.8, 0.07],
          },
          {
            name: "EMBL-EBI→广州",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [113.23, 23.16], // 广州
            ],
            value: [170, 24.6, 0.05],
          },
          {
            name: "DDBJ→广州",
            coords: [
              [138.91, 35.13], // DDBJ
              [113.23, 23.16], // 广州
            ],
            value: [150, 19.3, 0.09],
          },
          // 三个源连到深圳下载点
          {
            name: "NCBI→深圳",
            coords: [
              [-77.09, 38.98], // NCBI
              [114.07, 22.62], // 深圳
            ],
            value: [195, 18.2, 0.08],
          },
          {
            name: "EMBL-EBI→深圳",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [114.07, 22.62], // 深圳
            ],
            value: [175, 21.5, 0.06],
          },
          {
            name: "DDBJ→深圳",
            coords: [
              [138.91, 35.13], // DDBJ
              [114.07, 22.62], // 深圳
            ],
            value: [155, 17.8, 0.1],
          },
          // 三个源连到成都下载点
          {
            name: "NCBI→成都",
            coords: [
              [-77.09, 38.98], // NCBI
              [104.07, 30.67], // 成都
            ],
            value: [210, 15.4, 0.12],
          },
          {
            name: "EMBL-EBI→成都",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [104.07, 30.67], // 成都
            ],
            value: [185, 16.9, 0.09],
          },
          {
            name: "DDBJ→成都",
            coords: [
              [138.91, 35.13], // DDBJ
              [104.07, 30.67], // 成都
            ],
            value: [165, 14.2, 0.11],
          },
          // 三个源连到杭州下载点
          {
            name: "NCBI → 杭州",
            coords: [
              [-77.09, 38.98], // NCBI
              [120.15, 30.28], // 杭州
            ],
            value: [172, 26.3, 0.05],
          },
          {
            name: "EMBL-EBI→杭州",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [120.15, 30.28], // 杭州
            ],
            value: [158, 29.7, 0.03],
          },
          {
            name: "DDBJ→杭州",
            coords: [
              [138.91, 35.13], // DDBJ
              [120.15, 30.28], // 杭州
            ],
            value: [142, 27.4, 0.07],
          },
          // 三个源连到武汉下载点
          {
            name: "NCBI→武汉",
            coords: [
              [-77.09, 38.98], // NCBI
              [114.31, 30.59], // 武汉
            ],
            value: [185, 23.8, 0.08],
          },
          {
            name: "EMBL-EBI→武汉",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [114.31, 30.59], // 武汉
            ],
            value: [168, 25.6, 0.06],
          },
          {
            name: "DDBJ→武汉",
            coords: [
              [138.91, 35.13], // DDBJ
              [114.31, 30.59], // 武汉
            ],
            value: [148, 21.3, 0.09],
          },
          // 三个源连到西安下载点
          {
            name: "NCBI→西安",
            coords: [
              [-77.09, 38.98], // NCBI
              [108.95, 34.27], // 西安
            ],
            value: [195, 16.7, 0.1],
          },
          {
            name: "EMBL-EBI→西安",
            coords: [
              [0.13, 52.21], // EMBL-EBI
              [108.95, 34.27], // 西安
            ],
            value: [178, 18.9, 0.08],
          },
          {
            name: "DDBJ→西安",
            coords: [
              [138.91, 35.13], // DDBJ
              [108.95, 34.27], // 西安
            ],
            value: [158, 15.6, 0.11],
          },
        ],
      },
      {
        // origin：源站点（保持原有大点样式）
        type: "scatter",
        name: "origin",
        coordinateSystem: "geo",
        symbolSize: 30,
        zlevel: 2,
        itemStyle: {
          // 源点使用渐变橙色调
          color: function (params: any) {
            const colors = {
              NCBI: "#f97316", // 橙色
              "EMBL-EBI": "#fb923c", // 浅橙色
              DDBJ: "#fbbf24", // 琥珀色
            };
            return colors[params.name as keyof typeof colors] || "#fbbf24";
          },
          opacity: 1,
          shadowBlur: 20,
          shadowColor: "rgba(249, 115, 22, 0.3)",
        },
        label: {
          show: false,
        },
        tooltip: {
          formatter: function (params: any) {
            const fullNameMap = {
              NCBI: "NCBI（美国国家生物技术信息中心）",
              "EMBL-EBI": "EMBL-EBI（EMBL 的欧洲生物信息学研究所）",
              DDBJ: "DDBJ（生物信息与 DDBJ 中心）",
            };
            const countryMap = {
              NCBI: "美国",
              "EMBL-EBI": "英国",
              DDBJ: "日本",
            };
            const fullName = fullNameMap[params.name as keyof typeof fullNameMap] || params.name;
            const country = countryMap[params.name as keyof typeof countryMap] || "";
            return `<div style="padding: 8px;">
              <strong  style="color: #333; font-size: 14px; margin-bottom:8px;">${fullName}</strong><br/>
              <span style="color: #666;">所在国家: ${country}</span>
            </div>`;
          },
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          textStyle: {
            color: "#333",
            fontSize: 12,
          },
          extraCssText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 6px;",
        },
        data: [
          {
            name: "NCBI",
            value: [-77.09, 38.98], // 美国马里兰州贝塞斯达坐标
          },
          {
            name: "EMBL-EBI",
            value: [0.13, 52.21], // 英国剑桥坐标
          },
          {
            name: "DDBJ",
            value: [138.91, 35.13], // 日本三岛市坐标
          },
        ],
      },
      {
        // download：北京附近的若干下载 IP 点
        type: "scatter",
        name: "download",
        coordinateSystem: "geo",
        zlevel: 3,
        symbol: "circle",
        // 略微增大点，以便更清晰，同时用 symbolOffset 对重叠点进行像素级错开
        symbolSize: 12,
        itemStyle: {
          borderWidth: 1,
          color: "#71A6E1", // 靛蓝色，与连线颜色呼应
          opacity: 1,
          borderColor: "#3983d7",
        },
        // 鼠标悬停时显示更详细的 tooltip
        tooltip: {
          formatter: function (params: any) {
            return `
              <div style="padding: 8px; min-width: 180px;">
              <strong style="color: #333; font-size: 14px;">${params.name}</strong>
              <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                <span>IP地址</span>
                <span style="font-weight: bold; color: #1d4ed8;">${params.data.ip}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                <span>坐标</span>
                <span style="font-weight: bold;">${params.value}</span>
                </div>
              </div>
              </div>
            `;
          },
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          textStyle: {
            color: "#333",
            fontSize: 12,
          },
          extraCssText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 6px;",
        },
        // 通过 symbolOffset 为每个点设定不同的像素偏移，避免重叠
        label: {
          show: false,
        },
        data: [
          // 国内八个主要城市下载点
          { name: "北京下载点", value: [116.4, 39.9], ip: "202.106.0.20" },
          { name: "上海下载点", value: [121.47, 31.23], ip: "202.127.0.25" },
          { name: "广州下载点", value: [113.23, 23.16], ip: "202.116.0.18" },
          { name: "深圳下载点", value: [114.07, 22.62], ip: "202.104.0.22" },
          { name: "成都下载点", value: [104.07, 30.67], ip: "202.115.0.15" },
          { name: "杭州下载点", value: [120.15, 30.28], ip: "202.108.0.28" },
          { name: "武汉下载点", value: [114.31, 30.59], ip: "202.114.0.19" },
          { name: "西安下载点", value: [108.95, 34.27], ip: "202.117.0.16" },
        ],
      },
    ],
  };

  return () => (
    <Card bodyStyle={{ padding: 0 }} class="bg-white py-4 rounded-lg shadow-md">
      <Cechart option={worldMapOption} style={{ height: "500px" }} />
    </Card>
  );
});

export default WorldMap;
