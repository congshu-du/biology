import { defineComponent, ref } from "vue";
import { Modal, Descriptions, Tag, Divider, Space } from "ant-design-vue";
import { ProbeRecord } from "./data";
import dayjs from "dayjs";
import { token } from "@/utils/theme";
import { css } from "@emotion/css";

interface DetectionDetailProps {
  visible: boolean;
  record: ProbeRecord | null;
  onClose: () => void;
}

const DetectionDetail = defineComponent<DetectionDetailProps>(
  (props) => {
    const getPerformanceLevel = (responseTime: number) => {
      if (responseTime < 50) return "excellent";
      if (responseTime < 200) return "good";
      if (responseTime < 500) return "average";
      return "poor";
    };

    const getPerformanceLevelTag = (responseTime: number) => {
      const level = getPerformanceLevel(responseTime);
      const levelConfig = {
        excellent: { label: "优秀", color: token.green },
        good: { label: "良好", color: token.blue },
        average: { label: "一般", color: token.orange },
        poor: { label: "较差", color: token.red },
      };
      const config = levelConfig[level as keyof typeof levelConfig];
      return <Tag color={config.color}>{config.label}</Tag>;
    };

    const getStatusTag = (status: string) => {
      const statusConfig = {
        success: { label: "成功", color: "green" },
        failed: { label: "失败", color: "red" },
        timeout: { label: "超时", color: "orange" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Tag color={config.color}>{config.label}</Tag>;
    };

    const getToolTag = (tool: string) => {
      const colors = { curl: token.green, truncate: token.blue, ping: token.orange };
      return <Tag color={colors[tool as keyof typeof colors]}>{tool.toUpperCase()}</Tag>;
    };

    console.log(props, 1232);
    return () => (
      <Modal
        title={
          <Space>
            <span>探测详情</span>
            {props.record && (
              <Tag color={token.blue}>
                {props.record.probePoint} ({props.record.probeIp})
              </Tag>
            )}
          </Space>
        }
        open
        onCancel={props.onClose}
        footer={null}
        width={800}
        class={css`
          .ant-modal-body {
            max-height: 70vh;
            overflow-y: auto;
          }
          .ant-descriptions-item-label {
            font-weight: 600;
            width: 140px;
          }
          .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 6px;
            margin-bottom: 8px;
          }
          .metric-value {
            font-weight: bold;
            font-size: 16px;
          }
        `}
      >
        {props.record && (
          <div>
            {/* 基本信息 */}
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="探测时间">
                {dayjs(props.record.timestamp).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="探测点">
                <Tag color={token.blue}>{props.record.probePoint}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="探测点IP">
                <span style={{ fontFamily: "monospace" }}>{props.record.probeIp}</span>
              </Descriptions.Item>
              <Descriptions.Item label="数据源">
                <Tag color={token.green}>{props.record.dataSource}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="数据中心">{props.record.dataCenter}</Descriptions.Item>
              <Descriptions.Item label="数据源URL">
                <a href={props.record.dataSourceUrl} target="_blank" rel="noopener noreferrer">
                  {props.record.dataSourceUrl}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="综合状态">{getStatusTag(props.record.overallStatus)}</Descriptions.Item>
              <Descriptions.Item label="成功工具数">
                <Tag color="green">
                  {props.record.successToolCount}/{props.record.totalToolCount}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* 各探测工具详细结果 */}
            {props.record.toolResults.map((toolResult, index) => (
              <div key={index}>
                <Divider />
                <Descriptions title={`${toolResult.tool.toUpperCase()} 探测结果`} bordered column={2} size="small">
                  <Descriptions.Item label="探测状态">{getStatusTag(toolResult.status)}</Descriptions.Item>
                  <Descriptions.Item label="响应时间">
                    <span style={{ color: token.orange, fontWeight: "bold" }}>{toolResult.responseTime}ms</span>{" "}
                    {getPerformanceLevelTag(toolResult.responseTime)}
                  </Descriptions.Item>

                  {/* 根据探测工具类型显示不同指标 */}
                  {toolResult.tool === 'curl' && (
                    <>
                      <Descriptions.Item label="连接时间">{toolResult.connectTime}ms</Descriptions.Item>
                      <Descriptions.Item label="DNS解析时间">{toolResult.dnsResolveTime}ms</Descriptions.Item>
                      <Descriptions.Item label="SSL握手时间">{toolResult.sslHandshakeTime}ms</Descriptions.Item>
                      <Descriptions.Item label="下载速度">
                        {toolResult.downloadSpeed ? `${toolResult.downloadSpeed} Mbps` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="上传速度">
                        {toolResult.uploadSpeed ? `${toolResult.uploadSpeed} Mbps` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="吞吐量">
                        {toolResult.throughput ? `${toolResult.throughput} MB/s` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="带宽利用率">
                        {toolResult.bandwidth ? `${toolResult.bandwidth}%` : "-"}
                      </Descriptions.Item>
                    </>
                  )}

                  {toolResult.tool === 'truncate' && (
                    <>
                      <Descriptions.Item label="连接时间">{toolResult.connectTime}ms</Descriptions.Item>
                      <Descriptions.Item label="DNS解析时间">{toolResult.dnsResolveTime}ms</Descriptions.Item>
                      <Descriptions.Item label="SSL握手时间">{toolResult.sslHandshakeTime}ms</Descriptions.Item>
                      <Descriptions.Item label="下载速度">
                        {toolResult.downloadSpeed ? `${toolResult.downloadSpeed} Mbps` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="上传速度">
                        {toolResult.uploadSpeed ? `${toolResult.uploadSpeed} Mbps` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="带宽利用率">
                        {toolResult.bandwidth ? `${toolResult.bandwidth}%` : "-"}
                      </Descriptions.Item>
                    </>
                  )}

                  {toolResult.tool === 'ping' && (
                    <>
                      <Descriptions.Item label="DNS解析时间">{toolResult.dnsResolveTime}ms</Descriptions.Item>
                      <Descriptions.Item label="丢包率">
                        {toolResult.packetLoss !== undefined ? `${toolResult.packetLoss}%` : "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="网络抖动">
                        {toolResult.jitter ? `${toolResult.jitter}ms` : "-"}
                      </Descriptions.Item>
                    </>
                  )}

                  {toolResult.errorMessage && (
                    <>
                      <Descriptions.Item label="错误代码">
                        <Tag color={token.red}>{toolResult.errorCode}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="错误信息">
                        <span style={{ color: token.red }}>{toolResult.errorMessage}</span>
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </div>
            ))}

            <Divider />

            {/* 综合性能指标 */}
            <Descriptions title="综合性能指标" bordered column={2} size="small">
              <Descriptions.Item label="最佳响应时间">
                <span style={{ color: token.green, fontWeight: "bold" }}>{props.record.bestResponseTime}ms</span>{" "}
                {getPerformanceLevelTag(props.record.bestResponseTime)}
              </Descriptions.Item>
              <Descriptions.Item label="成功率">
                <Tag color={token.green}>
                  {((props.record.successToolCount / props.record.totalToolCount) * 100).toFixed(1)}%
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* 地理和网络信息 */}
            <Descriptions title="地理和网络信息" bordered column={2} size="small">
              <Descriptions.Item label="目标国家">{props.record.targetCountry}</Descriptions.Item>
              <Descriptions.Item label="目标地区">{props.record.targetRegion}</Descriptions.Item>
              <Descriptions.Item label="地理距离">{props.record.distance}km</Descriptions.Item>
              <Descriptions.Item label="路由跳数">{props.record.hopCount || "-"}</Descriptions.Item>
              <Descriptions.Item label="网络运营商" span={2}>
                {props.record.isp}
              </Descriptions.Item>
              {props.record.networkPath && (
                <Descriptions.Item label="网络路径" span={2}>
                  <span style={{ fontFamily: "monospace" }}>{props.record.networkPath}</span>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 探测工具说明 */}
            <Divider />
            <Descriptions title="探测工具说明" bordered column={1} size="small">
              <Descriptions.Item label="CURL">
                <div>
                  <p>
                    <strong>功能：</strong>测试数据源的HTTP/HTTPS连接和下载性能，模拟完整下载过程
                  </p>
                  <p>
                    <strong>主要指标：</strong>响应时间、连接时间、DNS解析时间、SSL握手时间、下载速度、上传速度、吞吐量、带宽利用率
                  </p>
                  <p>
                    <strong>用途：</strong>评估用户下载数据的完整体验，适合检测大文件下载性能
                  </p>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="TRUNCATE">
                <div>
                  <p>
                    <strong>功能：</strong>测试数据源的连接建立和初始响应，不下载完整内容
                  </p>
                  <p>
                    <strong>主要指标：</strong>响应时间、连接时间、DNS解析时间、SSL握手时间、下载速度、上传速度、带宽利用率
                  </p>
                  <p>
                    <strong>用途：</strong>快速检测数据源可达性和响应性能，适合频繁检测服务状态
                  </p>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="PING">
                <div>
                  <p>
                    <strong>功能：</strong>测试网络延迟和基础连通性，使用ICMP协议
                  </p>
                  <p>
                    <strong>主要指标：</strong>响应时间、DNS解析时间、丢包率、网络抖动
                  </p>
                  <p>
                    <strong>用途：</strong>基础网络质量检测，检测网络路径稳定性和延迟
                  </p>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    );
  },
  { props: ["visible", "record", "onClose"] },
);

export default DetectionDetail;
