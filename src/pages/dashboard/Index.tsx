import { defineComponent, ref } from "vue";
import WorldMap from "./components/WorldMap";
import ChinaMap from "./components/ChinaMap";
import { Card, Col, Row, Select, Space, Statistic } from "ant-design-vue";
import { ExclamationCircleOutlined, GlobalOutlined, WifiOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";
import DownloadSort from "./components/DownloadSort";
import AlertSort from "./components/AlertSort";

const Dashboard = defineComponent(() => {
  const timeRange = ref<string>("1h");

  const options = [
    { label: "最近一小时", value: "1h" },
    { label: "最近六小时", value: "6h" },
    { label: "最近十二小时", value: "12h" },
    { label: "最近一天", value: "1d" },
    { label: "最近三天", value: "3d" },
    { label: "最近一周", value: "7d" },
  ];

  return () => (
    <div class="p-4">
      <Space class="mb-4">
        <Select class="w-48" options={options} v-model={[timeRange.value, "value"]} />
      </Space>
      <Row class="mb-4" gutter={16}>
        <Col span={6}>
          <Card class="h-30 bg-white flex flex-col justify-center items-center shadow-md">
            <Statistic
              title={<div style={{ textAlign: "center" }}>告警数量</div>}
              value={11}
              prefix={
                <span style={{ fontSize: 24, color: "#faad14" }}>
                  <ExclamationCircleOutlined />
                </span>
              }
              suffix={<span style={{ fontWeight: 500, color: "#888" }}>个</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card class="h-30 bg-white flex flex-col justify-center items-center shadow-md">
            <Statistic
              title={<div style={{ textAlign: "center" }}>探针总数</div>}
              value={156}
              prefix={
                <span style={{ fontSize: 24, color: "#1890ff" }}>
                  <GlobalOutlined />
                </span>
              }
              suffix={<span style={{ fontWeight: 500, color: "#888" }}>个</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card class="h-30 bg-white flex flex-col justify-center items-center shadow-md">
            <Statistic
              title={<div style={{ textAlign: "center" }}>国际网络延迟/丢包率</div>}
              value={25}
              prefix={
                <span style={{ fontSize: 24, color: "#52c41a" }}>
                  <WifiOutlined />
                </span>
              }
              suffix={<span style={{ fontWeight: 500, color: "#888" }}>ms / 0.12%</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card class="h-30 bg-white flex flex-col justify-center items-center shadow-md">
            <Statistic
              title={<div style={{ textAlign: "center" }}>国内网络延迟/丢包率</div>}
              value={15}
              prefix={
                <span style={{ fontSize: 24, color: "#eb2f96" }}>
                  <EnvironmentOutlined />
                </span>
              }
              suffix={<span style={{ fontWeight: 500, color: "#888" }}>ms / 0.08%</span>}
            />
          </Card>
        </Col>
      </Row>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorldMap time={timeRange.value} />
        <ChinaMap time={timeRange.value} />
      </div>
      <Row gutter={16} class="mt-4">
        <Col span={12}>
          <Card class="shadow-md" bodyStyle={{ padding: 0, height: "400px", overflow: "hidden" }}>
            <DownloadSort time={timeRange.value} />
          </Card>
        </Col>
        <Col span={12}>
          <Card class="shadow-md" bodyStyle={{ padding: 0, height: "400px", overflow: "hidden" }}>
            <AlertSort time={timeRange.value} />
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Dashboard;
