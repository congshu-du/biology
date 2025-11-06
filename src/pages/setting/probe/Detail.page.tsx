import { Badge, Button, Card, Col, Descriptions, Row, Space, Tag, message, Select, Divider } from "ant-design-vue";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { token } from "@/utils/theme";
import * as echarts from "echarts";

interface ProbeDetail {
  id: string;
  name: string;
  ip: string;
  location: string;
  dataCenter: string;
  connectivity: "connected" | "disconnected";
  status: "detecting" | "stopped";
  createTime: string;
  updateTime: string;
  version: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
}

interface DetectionHistory {
  time: string;
  avgLatency: number;
  packetLoss: number;
  connectivity: number; // 1: 连通, 0: 断开
  downloadSpeed: number; // 下载速度 (Mbps)
}

// 探测源选项
const DETECTION_SOURCE_OPTIONS = [
  { label: "NCBI", value: "1", desc: "美国国家生物技术信息中心" },
  { label: "EMBL-EBI", value: "2", desc: "欧洲分子生物学实验室欧洲生物信息学研究所" },
  { label: "DDBJ", value: "3", desc: "日本DNA数据库" },
];

// 按时间点分组的探测结果
interface DetectionSnapshot {
  id: string;
  time: string;
  status: "success" | "partial" | "failed";
  results: {
    tool: string;
    target: string;
    status: "success" | "failed";
    duration: number;
    result: string;
  }[];
}

const ProbeDetailPage = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const refreshing = ref(false);

  // 从URL获取探针ID
  const probeId = route.query.id as string;

  // 选中的探测源
  const selectedSource = ref("1"); // 默认选中NCBI

  // 探针详细信息
  const probeDetail = ref<ProbeDetail>({
    id: probeId || "1",
    name: "探针1",
    ip: "192.168.1.100",
    location: "北京",
    dataCenter: "北京数据中心A",
    connectivity: "connected",
    status: "detecting",
    createTime: "2024-01-15 09:00:00",
    updateTime: "2025-11-06 14:30:00",
    version: "v2.5.1",
    cpuUsage: 35.6,
    memoryUsage: 68.2,
    diskUsage: 42.8,
    uptime: 15 * 24 * 60 * 60, // 15天
  });

  // 最近探测结果快照（按时间点分组）
  const recentSnapshots = ref<DetectionSnapshot[]>([
    {
      id: "1",
      time: "2025-11-06 14:35:00",
      status: "success",
      results: [
        {
          tool: "Ping",
          target: "8.8.8.8",
          status: "success",
          duration: 23,
          result: "平均延迟: 23ms, 丢包率: 0%",
        },
        {
          tool: "Traceroute",
          target: "baidu.com",
          status: "success",
          duration: 1250,
          result: "经过 12 跳到达目标",
        },
        {
          tool: "MTR",
          target: "qq.com",
          status: "success",
          duration: 3560,
          result: "平均延迟: 45ms, 丢包率: 0.5%",
        },
        {
          tool: "Curl",
          target: "https://api.example.com",
          status: "success",
          duration: 850,
          result: "状态码: 200, 响应时间: 850ms",
        },
      ],
    },
    {
      id: "2",
      time: "2025-11-06 14:30:00",
      status: "partial",
      results: [
        {
          tool: "Ping",
          target: "8.8.8.8",
          status: "success",
          duration: 25,
          result: "平均延迟: 25ms, 丢包率: 0%",
        },
        {
          tool: "Traceroute",
          target: "baidu.com",
          status: "success",
          duration: 1380,
          result: "经过 12 跳到达目标",
        },
        {
          tool: "MTR",
          target: "qq.com",
          status: "success",
          duration: 3200,
          result: "平均延迟: 42ms, 丢包率: 0.3%",
        },
        {
          tool: "Curl",
          target: "https://api.example.com",
          status: "failed",
          duration: 5000,
          result: "连接超时",
        },
      ],
    },
    {
      id: "3",
      time: "2025-11-06 14:25:00",
      status: "success",
      results: [
        {
          tool: "Ping",
          target: "8.8.8.8",
          status: "success",
          duration: 21,
          result: "平均延迟: 21ms, 丢包率: 0%",
        },
        {
          tool: "Traceroute",
          target: "baidu.com",
          status: "success",
          duration: 1150,
          result: "经过 11 跳到达目标",
        },
        {
          tool: "MTR",
          target: "qq.com",
          status: "success",
          duration: 3100,
          result: "平均延迟: 38ms, 丢包率: 0%",
        },
        {
          tool: "Curl",
          target: "https://api.example.com",
          status: "success",
          duration: 780,
          result: "状态码: 200, 响应时间: 780ms",
        },
      ],
    },
  ]);

  // 历史数据（用于图表）
  const historyData = ref<DetectionHistory[]>([
    { time: "14:00", avgLatency: 25, packetLoss: 0, connectivity: 1, downloadSpeed: 95.2 },
    { time: "14:05", avgLatency: 28, packetLoss: 0.2, connectivity: 1, downloadSpeed: 92.5 },
    { time: "14:10", avgLatency: 23, packetLoss: 0, connectivity: 1, downloadSpeed: 98.3 },
    { time: "14:15", avgLatency: 30, packetLoss: 0.5, connectivity: 1, downloadSpeed: 88.7 },
    { time: "14:20", avgLatency: 26, packetLoss: 0.1, connectivity: 1, downloadSpeed: 94.1 },
    { time: "14:25", avgLatency: 24, packetLoss: 0, connectivity: 1, downloadSpeed: 97.6 },
    { time: "14:30", avgLatency: 27, packetLoss: 0.3, connectivity: 1, downloadSpeed: 91.8 },
    { time: "14:35", avgLatency: 23, packetLoss: 0, connectivity: 1, downloadSpeed: 99.2 },
  ]);

  // 返回列表页
  const handleBack = () => {
    router.push("/setting/probe");
  };

  // 刷新数据
  const handleRefresh = async () => {
    try {
      refreshing.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("数据已刷新");
    } catch (error) {
      message.error(`刷新失败: ${error}`);
    } finally {
      refreshing.value = false;
    }
  };

  // 启动/停止探针
  const toggleProbeStatus = async () => {
    try {
      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (probeDetail.value.status === "detecting") {
        probeDetail.value.status = "stopped";
        message.success("探针已停止");
      } else {
        probeDetail.value.status = "detecting";
        message.success("探针已启动");
      }
    } catch (error) {
      message.error(`操作失败: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  // 前往设置页
  const goToSettings = () => {
    router.push(`/setting/probe/setup?id=${probeId}`);
  };

  // 切换探测源
  const handleSourceChange = (value: any) => {
    selectedSource.value = value;
    // 这里可以根据选中的探测源重新加载数据
    message.info(`已切换到探测源: ${DETECTION_SOURCE_OPTIONS.find((s) => s.value === value)?.label}`);
  };

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  // 获取快照状态的映射
  const snapshotStatusColorMap: Record<string, string> = {
    success: token.colorSuccess,
    partial: token.colorWarning,
    failed: token.colorError,
  };

  const snapshotStatusTextMap: Record<string, string> = {
    success: "全部成功",
    partial: "部分失败",
    failed: "全部失败",
  };

  // 初始化图表
  const initCharts = () => {
    // 连通性图表
    const connectivityChart = echarts.init(document.getElementById("connectivityChart") as HTMLElement);
    connectivityChart.setOption({
      title: {
        text: "连通性趋势",
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const data = params[0];
          const status = data.value === 1 ? "连通" : "断开";
          return `${data.name}<br/>${data.seriesName}: ${status}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: historyData.value.map((item) => item.time),
      },
      yAxis: {
        type: "value",
        name: "状态",
        min: 0,
        max: 1,
        interval: 1,
        axisLabel: {
          formatter: (value: number) => (value === 1 ? "连通" : "断开"),
        },
      },
      series: [
        {
          name: "连通性",
          type: "line",
          step: "end",
          data: historyData.value.map((item) => item.connectivity),
          lineStyle: {
            color: token.colorSuccess,
            width: 2,
          },
          itemStyle: {
            color: token.colorSuccess,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(82, 196, 26, 0.3)" },
              { offset: 1, color: "rgba(82, 196, 26, 0.05)" },
            ]),
          },
        },
      ],
    });

    // 延迟图表
    const latencyChart = echarts.init(document.getElementById("latencyChart") as HTMLElement);
    latencyChart.setOption({
      title: {
        text: "网络延迟趋势",
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: historyData.value.map((item) => item.time),
      },
      yAxis: {
        type: "value",
        name: "延迟 (ms)",
      },
      series: [
        {
          name: "平均延迟",
          type: "line",
          smooth: true,
          data: historyData.value.map((item) => item.avgLatency),
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(24, 144, 255, 0.3)" },
              { offset: 1, color: "rgba(24, 144, 255, 0.05)" },
            ]),
          },
          lineStyle: {
            color: token.colorPrimary,
          },
          itemStyle: {
            color: token.colorPrimary,
          },
        },
      ],
    });

    // 丢包率图表
    const packetLossChart = echarts.init(document.getElementById("packetLossChart") as HTMLElement);
    packetLossChart.setOption({
      title: {
        text: "丢包率趋势",
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: historyData.value.map((item) => item.time),
      },
      yAxis: {
        type: "value",
        name: "丢包率 (%)",
        max: 5,
      },
      series: [
        {
          name: "丢包率",
          type: "line",
          smooth: true,
          data: historyData.value.map((item) => item.packetLoss),
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(255, 77, 79, 0.3)" },
              { offset: 1, color: "rgba(255, 77, 79, 0.05)" },
            ]),
          },
          lineStyle: {
            color: token.colorError,
          },
          itemStyle: {
            color: token.colorError,
          },
        },
      ],
    });

    // 下载速度图表
    const downloadSpeedChart = echarts.init(document.getElementById("downloadSpeedChart") as HTMLElement);
    downloadSpeedChart.setOption({
      title: {
        text: "下载速度趋势",
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>${data.seriesName}: ${data.value} Mbps`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: historyData.value.map((item) => item.time),
      },
      yAxis: {
        type: "value",
        name: "速度 (Mbps)",
        min: 0,
        max: 100,
      },
      series: [
        {
          name: "下载速度",
          type: "line",
          smooth: true,
          data: historyData.value.map((item) => item.downloadSpeed),
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(114, 46, 209, 0.3)" },
              { offset: 1, color: "rgba(114, 46, 209, 0.05)" },
            ]),
          },
          lineStyle: {
            color: "#722ED1",
          },
          itemStyle: {
            color: "#722ED1",
          },
        },
      ],
    });

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      connectivityChart.resize();
      latencyChart.resize();
      packetLossChart.resize();
      downloadSpeedChart.resize();
    });
  };

  // 组件挂载后初始化图表
  onMounted(() => {
    setTimeout(() => {
      initCharts();
    }, 100);
  });

  return () => (
    <div class="flex flex-col h-full bg-gray-50">
      {/* 页面头部 */}
      <div class="flex items-center justify-between p-4 bg-white border-b">
        <div class="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="text" />
          <h2 class="text-xl font-semibold m-0">探针详情</h2>
        </div>
        <Space>
          <Select
            v-model:value={selectedSource.value}
            style={{ width: "200px" }}
            onChange={handleSourceChange}
            options={DETECTION_SOURCE_OPTIONS}
            placeholder="选择探测源"
          />
          <Divider type="vertical" />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing.value}>
            刷新
          </Button>
          {probeDetail.value.status === "detecting" ? (
            <Button type="primary" danger onClick={toggleProbeStatus} loading={loading.value}>
              停止探针
            </Button>
          ) : (
            <Button type="primary" onClick={toggleProbeStatus} loading={loading.value}>
              启动探针
            </Button>
          )}
          <Button onClick={goToSettings}>探针设置</Button>
        </Space>
      </div>

      {/* 页面内容 */}
      <div class="flex-1 p-4 overflow-auto">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* 基本信息和状态 */}
          <Row gutter={16}>
            {/* 基本信息卡片 */}
            <Col span={16}>
              <Card title="基本信息" bordered={false}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="探针名称">{probeDetail.value.name}</Descriptions.Item>
                  <Descriptions.Item label="IP地址">{probeDetail.value.ip}</Descriptions.Item>
                  <Descriptions.Item label="所在位置">{probeDetail.value.location}</Descriptions.Item>
                  <Descriptions.Item label="机房">{probeDetail.value.dataCenter}</Descriptions.Item>
                  <Descriptions.Item label="连通性">
                    <Tag
                      color={probeDetail.value.connectivity === "connected" ? token.colorSuccess : token.colorError}
                      icon={
                        probeDetail.value.connectivity === "connected" ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    >
                      {probeDetail.value.connectivity === "connected" ? "已联通" : "未联通"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="运行状态">
                    <Tag
                      color={probeDetail.value.status === "detecting" ? token.colorPrimary : "default"}
                      icon={<ClockCircleOutlined />}
                    >
                      {probeDetail.value.status === "detecting" ? "持续探测中" : "未开启探测"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="版本号">{probeDetail.value.version}</Descriptions.Item>
                  <Descriptions.Item label="运行时长">{formatUptime(probeDetail.value.uptime)}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {dayjs(probeDetail.value.createTime).format("YYYY-MM-DD HH:mm:ss")}
                  </Descriptions.Item>
                  <Descriptions.Item label="更新时间">
                    {dayjs(probeDetail.value.updateTime).format("YYYY-MM-DD HH:mm:ss")}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Row class="mt-4" gutter={[16, 16]}>
                <Col span={12}>
                  <Card bordered={false}>
                    <div id="connectivityChart" style={{ width: "100%", height: "250px" }}></div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false}>
                    <div id="latencyChart" style={{ width: "100%", height: "250px" }}></div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false}>
                    <div id="packetLossChart" style={{ width: "100%", height: "250px" }}></div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false}>
                    <div id="downloadSpeedChart" style={{ width: "100%", height: "250px" }}></div>
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* 最近探测结果 */}
            <Col span={8}>
              <Card title="最近探测结果" style={{ height: "100%" }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {recentSnapshots.value.slice(0, 5).map((snapshot) => (
                    <Card
                      key={snapshot.id}
                      size="small"
                      title={
                        <Space>
                          <ClockCircleOutlined />
                          <span>{dayjs(snapshot.time).format("MM-DD HH:mm:ss")}</span>
                        </Space>
                      }
                      extra={
                        <Badge
                          status={
                            snapshot.status === "success"
                              ? "success"
                              : snapshot.status === "partial"
                                ? "warning"
                                : "error"
                          }
                          text={snapshotStatusTextMap[snapshot.status]}
                        />
                      }
                      bordered
                    >
                      <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        {snapshot.results.map((result, index) => (
                          <div
                            key={index}
                            style={{
                              padding: "8px 0",
                              borderBottom: index < snapshot.results.length - 1 ? "1px solid #f0f0f0" : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <Space size="small">
                                {result.status === "success" ? (
                                  <CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: "16px" }} />
                                ) : (
                                  <CloseCircleOutlined style={{ color: token.colorError, fontSize: "16px" }} />
                                )}
                                <span style={{ fontWeight: 500 }}>{result.tool}</span>
                              </Space>
                              <span style={{ color: "#999", fontSize: "12px" }}>{result.duration}ms</span>
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginLeft: "24px",
                                lineHeight: "1.5",
                              }}
                            >
                              {result.result}
                            </div>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </div>
    </div>
  );
});

export default ProbeDetailPage;
