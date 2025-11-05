import { defineComponent, ref, computed } from "vue";
import Cechart from "@/components/echart/Cechart";
import { Card, Select } from "ant-design-vue";
import type { SelectValue } from "ant-design-vue/es/select";

interface ChinaMapProps {
  time?: string;
}

const ChinaMap = defineComponent<ChinaMapProps>((props) => {
  // 当前选择的下载点
  const currentDownloadPoint = ref("genomecenter");

  // 下载点配置
  const downloadPointConfig = {
    genomecenter: {
      name: "基因组所",
      baseMetrics: {
        latency: 45,
        downloadSpeed: 28.5,
        packetLoss: 0.02,
      },
    },
    netcenter: {
      name: "网络中心",
      baseMetrics: {
        latency: 38,
        downloadSpeed: 35.2,
        packetLoss: 0.015,
      },
    },
    zhangjiakou: {
      name: "张家口",
      baseMetrics: {
        latency: 62,
        downloadSpeed: 22.8,
        packetLoss: 0.035,
      },
    },
  };

  // 根据省份生成下载指标数据
  const generateProvinceMetrics = (provinceName: string, baseMetrics: any) => {
    const distanceFactor = {
      北京: 1.0,
      天津: 1.05,
      河北: 1.1,
      山西: 1.15,
      内蒙古: 1.25,
      辽宁: 1.2,
      吉林: 1.3,
      黑龙江: 1.35,
      上海: 1.08,
      江苏: 1.12,
      浙江: 1.15,
      安徽: 1.18,
      福建: 1.22,
      江西: 1.2,
      山东: 1.1,
      河南: 1.15,
      湖北: 1.18,
      湖南: 1.22,
      广东: 1.25,
      广西: 1.28,
      海南: 1.35,
      重庆: 1.2,
      四川: 1.25,
      贵州: 1.3,
      云南: 1.32,
      西藏: 1.45,
      陕西: 1.18,
      甘肃: 1.28,
      青海: 1.38,
      宁夏: 1.25,
      新疆: 1.5,
      香港: 1.15,
      澳门: 1.12,
    };

    const factor = distanceFactor[provinceName as keyof typeof distanceFactor] || 1.2;
    const baseDownload = Math.floor(Math.random() * 50 + 20) * factor;

    return {
      totalDownload: baseDownload.toFixed(1),
      downloadValue: baseDownload, // 原始数值用于计算点的大小
      latency: Math.floor(baseMetrics.latency * factor),
      downloadSpeed: (baseMetrics.downloadSpeed / factor).toFixed(1),
      packetLoss: (baseMetrics.packetLoss * factor).toFixed(3),
    };
  };

  // 根据下载量计算点的大小
  const calculatePointSize = (downloadValue: number) => {
    // 设置最小和最大点的大小
    const minSize = 6;
    const maxSize = 20;

    // 根据下载量映射到点的大小范围
    const minDownload = 20;
    const maxDownload = 100;

    // 使用对数缩放让差异更明显
    const normalizedValue =
      (Math.log(downloadValue) - Math.log(minDownload)) / (Math.log(maxDownload) - Math.log(minDownload));
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));

    return minSize + (maxSize - minSize) * clampedValue;
  };

  // 获取带有动态大小的省份数据
  const getProvinceData = () => {
    const baseMetrics = downloadPointConfig[currentDownloadPoint.value].baseMetrics;
    return [
      // 直辖市
      {
        name: "北京",
        value: [116.4, 39.9],
        symbolSize: calculatePointSize(generateProvinceMetrics("北京", baseMetrics).downloadValue),
      },
      {
        name: "上海",
        value: [121.47, 31.23],
        symbolSize: calculatePointSize(generateProvinceMetrics("上海", baseMetrics).downloadValue),
      },
      {
        name: "天津",
        value: [117.2, 39.13],
        symbolSize: calculatePointSize(generateProvinceMetrics("天津", baseMetrics).downloadValue),
      },
      {
        name: "重庆",
        value: [106.55, 29.57],
        symbolSize: calculatePointSize(generateProvinceMetrics("重庆", baseMetrics).downloadValue),
      },

      // 省份（使用省会坐标，但显示省份名称）
      {
        name: "河北",
        value: [114.48, 38.03],
        symbolSize: calculatePointSize(generateProvinceMetrics("河北", baseMetrics).downloadValue),
      }, // 石家庄坐标
      {
        name: "山西",
        value: [112.53, 37.87],
        symbolSize: calculatePointSize(generateProvinceMetrics("山西", baseMetrics).downloadValue),
      }, // 太原坐标
      {
        name: "内蒙古",
        value: [111.65, 40.82],
        symbolSize: calculatePointSize(generateProvinceMetrics("内蒙古", baseMetrics).downloadValue),
      }, // 呼和浩特坐标
      {
        name: "辽宁",
        value: [123.38, 41.8],
        symbolSize: calculatePointSize(generateProvinceMetrics("辽宁", baseMetrics).downloadValue),
      }, // 沈阳坐标
      {
        name: "吉林",
        value: [125.35, 43.88],
        symbolSize: calculatePointSize(generateProvinceMetrics("吉林", baseMetrics).downloadValue),
      }, // 长春坐标
      {
        name: "黑龙江",
        value: [126.63, 45.75],
        symbolSize: calculatePointSize(generateProvinceMetrics("黑龙江", baseMetrics).downloadValue),
      }, // 哈尔滨坐标
      {
        name: "江苏",
        value: [118.78, 32.04],
        symbolSize: calculatePointSize(generateProvinceMetrics("江苏", baseMetrics).downloadValue),
      }, // 南京坐标
      {
        name: "浙江",
        value: [120.15, 30.28],
        symbolSize: calculatePointSize(generateProvinceMetrics("浙江", baseMetrics).downloadValue),
      }, // 杭州坐标
      {
        name: "安徽",
        value: [117.27, 31.86],
        symbolSize: calculatePointSize(generateProvinceMetrics("安徽", baseMetrics).downloadValue),
      }, // 合肥坐标
      {
        name: "福建",
        value: [119.3, 26.08],
        symbolSize: calculatePointSize(generateProvinceMetrics("福建", baseMetrics).downloadValue),
      }, // 福州坐标
      {
        name: "江西",
        value: [115.89, 28.68],
        symbolSize: calculatePointSize(generateProvinceMetrics("江西", baseMetrics).downloadValue),
      }, // 南昌坐标
      {
        name: "山东",
        value: [117.0, 36.65],
        symbolSize: calculatePointSize(generateProvinceMetrics("山东", baseMetrics).downloadValue),
      }, // 济南坐标
      {
        name: "河南",
        value: [113.65, 34.76],
        symbolSize: calculatePointSize(generateProvinceMetrics("河南", baseMetrics).downloadValue),
      }, // 郑州坐标
      {
        name: "湖北",
        value: [114.31, 30.59],
        symbolSize: calculatePointSize(generateProvinceMetrics("湖北", baseMetrics).downloadValue),
      }, // 武汉坐标
      {
        name: "湖南",
        value: [113.0, 28.21],
        symbolSize: calculatePointSize(generateProvinceMetrics("湖南", baseMetrics).downloadValue),
      }, // 长沙坐标
      {
        name: "广东",
        value: [113.23, 23.16],
        symbolSize: calculatePointSize(generateProvinceMetrics("广东", baseMetrics).downloadValue),
      }, // 广州坐标
      {
        name: "广西",
        value: [108.33, 22.84],
        symbolSize: calculatePointSize(generateProvinceMetrics("广西", baseMetrics).downloadValue),
      }, // 南宁坐标
      {
        name: "海南",
        value: [110.35, 20.02],
        symbolSize: calculatePointSize(generateProvinceMetrics("海南", baseMetrics).downloadValue),
      }, // 海口坐标
      {
        name: "四川",
        value: [104.07, 30.67],
        symbolSize: calculatePointSize(generateProvinceMetrics("四川", baseMetrics).downloadValue),
      }, // 成都坐标
      {
        name: "贵州",
        value: [106.71, 26.57],
        symbolSize: calculatePointSize(generateProvinceMetrics("贵州", baseMetrics).downloadValue),
      }, // 贵阳坐标
      {
        name: "云南",
        value: [102.73, 25.04],
        symbolSize: calculatePointSize(generateProvinceMetrics("云南", baseMetrics).downloadValue),
      }, // 昆明坐标
      {
        name: "西藏",
        value: [91.11, 29.97],
        symbolSize: calculatePointSize(generateProvinceMetrics("西藏", baseMetrics).downloadValue),
      }, // 拉萨坐标
      {
        name: "陕西",
        value: [108.95, 34.27],
        symbolSize: calculatePointSize(generateProvinceMetrics("陕西", baseMetrics).downloadValue),
      }, // 西安坐标
      {
        name: "甘肃",
        value: [103.73, 36.03],
        symbolSize: calculatePointSize(generateProvinceMetrics("甘肃", baseMetrics).downloadValue),
      }, // 兰州坐标
      {
        name: "青海",
        value: [101.74, 36.56],
        symbolSize: calculatePointSize(generateProvinceMetrics("青海", baseMetrics).downloadValue),
      }, // 西宁坐标
      {
        name: "宁夏",
        value: [106.27, 38.47],
        symbolSize: calculatePointSize(generateProvinceMetrics("宁夏", baseMetrics).downloadValue),
      }, // 银川坐标
      {
        name: "新疆",
        value: [87.68, 43.77],
        symbolSize: calculatePointSize(generateProvinceMetrics("新疆", baseMetrics).downloadValue),
      }, // 乌鲁木齐坐标

      // 特别行政区
      {
        name: "香港",
        value: [114.17, 22.32],
        symbolSize: calculatePointSize(generateProvinceMetrics("香港", baseMetrics).downloadValue),
      },
      {
        name: "澳门",
        value: [113.55, 22.21],
        symbolSize: calculatePointSize(generateProvinceMetrics("澳门", baseMetrics).downloadValue),
      },
    ];
  };

  // 中国地图配置（使用计算属性使其响应式）
  const chinaMapOption = computed(() => ({
    title: {
      text: "国内网络探测情况",
      left: "center",
      textStyle: {
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.seriesType === "scatter") {
          const baseMetrics = downloadPointConfig[currentDownloadPoint.value].baseMetrics;
          const metrics = generateProvinceMetrics(params.name, baseMetrics);

          return `
            <div style="padding: 8px; min-width: 200px;">
              <strong style="color: #333; font-size: 14px;">${params.name}</strong>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background: #fef3c7; color: #ea580c; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">下载速度</div>
                <div style="font-weight: bold; font-size: 16px;">${metrics.downloadSpeed} MB/s</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background: #d1fae5; color: #059669; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">网络延迟</div>
                <div style="font-weight: bold; font-size: 16px;">${metrics.latency} ms</div>
                </div>
                <div style="flex: 1; background: #ede9fe; color: #7c3aed; border-radius: 6px; padding: 8px 0; text-align: center;">
                <div style="font-size: 12px; color: #666;">丢包率</div>
                <div style="font-weight: bold; font-size: 16px;">${(parseFloat(metrics.packetLoss) * 100).toFixed(2)}%</div>
                </div>
              </div>
              </div>
            </div>
            `;
        }
        return `${params.name}<br/>数据量: ${params.value || 0}`;
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
    // 使用geo配置地图样式
    geo: [
      {
        // left: "5%",
        // right: "5%",
        top: "16px",
        bottom: "16px",
        map: "china",
        // roam: true,
        // zoom: 1.2, // 适当放大
        // center: [104, 35], // 设置地图中心点
        scaleLimit: {
          min: 0.8,
          max: 5,
        },
        label: {
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          color: "#E8F4FD", // 与世界地图一致的颜色
          borderColor: "#B8D9F5",
          areaColor: "#E8F4FD",
        },
        emphasis: {
          disabled: true,
        },
      },
    ],
    series: [
      // 省会城市标记点
      {
        type: "scatter",
        name: "省份/直辖市",
        coordinateSystem: "geo",
        zlevel: 2,
        symbol: "circle",
        itemStyle: {
          borderWidth: 1,
          color: "#71A6E1", // 靛蓝色，与连线颜色呼应
          opacity: 1,
          borderColor: "#3983d7",
        },
        label: {
          show: true,
          position: "top",
          formatter: "{b}",
          fontSize: 10,
          color: "#333",
        },
        data: getProvinceData(),
      },
    ],
  }));

  const handleDownloadPointChange = (value: SelectValue) => {
    if (typeof value === "string") {
      currentDownloadPoint.value = value;
    }
  };

  return () => (
    <Card bodyStyle={{ padding: 0 }} class="bg-white relative p-4 rounded-lg shadow-md">
      <div class="absolute top-4 right-4 z-10">
        <Select
          class="w-30"
          value={currentDownloadPoint.value}
          onChange={handleDownloadPointChange}
          options={[
            { label: "张家口", value: "zhangjiakou" },
            {
              label: "网络中心",
              value: "netcenter",
            },
            { label: "基因组所", value: "genomecenter" },
          ]}
        />
      </div>
      <Cechart option={chinaMapOption.value} style={{ height: "500px" }} />
    </Card>
  );
});

export default ChinaMap;
