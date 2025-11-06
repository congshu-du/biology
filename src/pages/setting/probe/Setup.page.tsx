import { Button, Col, Form, InputNumber, Row, Space, message } from "ant-design-vue";
import { CheckOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// 探测源列表
const DETECTION_SOURCES = [
  {
    id: "1",
    name: "NCBI",
    url: "https://www.ncbi.nlm.nih.gov",
    desc: "美国国家生物技术信息中心",
  },
  {
    id: "2",
    name: "EMBL-EBI",
    url: "https://www.ebi.ac.uk",
    desc: "欧洲分子生物学实验室欧洲生物信息学研究所",
  },
  {
    id: "3",
    name: "DDBJ",
    url: "https://www.ddbj.nig.ac.jp",
    desc: "日本DNA数据库",
  },
];

// 网络探测工具列表
const PROBE_TOOLS = [
  {
    label: "Ping",
    value: "ping",
    description:
      "最基础的网络诊断工具，通过发送ICMP回显请求测试目标主机的可达性，测量往返时间(RTT)和丢包率，是网络故障排查的首选工具。支持设置数据包大小、发送间隔、TTL值等参数，广泛应用于网络连通性测试和延迟监控。",
    icon: "https://cdn-icons-png.flaticon.com/512/2165/2165004.png",
  },
  {
    label: "Curl",
    value: "curl",
    description:
      "强大的HTTP/HTTPS客户端工具，支持多种协议(HTTP、FTP、SMTP、LDAP等)，可测试API接口、下载文件、模拟各种请求方法(GET、POST、PUT、DELETE)。常用于Web服务测试、API调试、性能测试，支持认证、代理、cookie等高级功能。",
    icon: "https://curl.se/logo/curl-logo.svg",
  },
  {
    label: "Wget",
    value: "wget",
    description:
      "非交互式网络下载工具，支持HTTP、HTTPS和FTP协议，可递归下载、断点续传、后台运行、限速下载。适合批量下载文件、镜像站点、定时下载任务。支持通过代理服务器下载、SSL/TLS加密传输、认证下载等功能。",
    icon: "https://www.gnu.org/graphics/gnu-head-sm.png",
  },
  {
    label: "Traceroute",
    value: "traceroute",
    description:
      "路由追踪工具，显示数据包从源到目标的完整网络路径，记录每一跳路由器的IP地址和响应延迟时间。帮助定位网络瓶颈、路由环路、网络拥塞点。支持ICMP、UDP、TCP等多种探测协议，可指定端口和超时时间。",
    icon: "https://cdn-icons-png.flaticon.com/512/1705/1705312.png",
  },
  {
    label: "MTR",
    value: "mtr",
    description:
      "结合ping和traceroute功能的高级网络诊断工具，实时动态显示每一跳的丢包率、平均延迟、最佳/最差延迟、标准差等统计数据。提供更直观的网络质量分析和持续监控能力，支持报告模式和图形界面。",
    icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
  },
  {
    label: "Netcat",
    value: "netcat",
    description:
      "网络瑞士军刀，支持TCP/UDP连接建立、端口扫描、数据传输、端口监听、反向Shell等功能。可用于网络调试、安全测试、文件传输、聊天服务器搭建。支持零I/O模式端口扫描、代理连接、加密传输等高级特性。",
    icon: "https://cdn-icons-png.flaticon.com/512/2920/2920349.png",
  },
  {
    label: "Dig",
    value: "dig",
    description:
      "DNS查询工具，提供详细完整的DNS解析信息，包括A记录、AAAA记录、MX邮件记录、NS权威服务器、CNAME别名、TXT文本记录等。支持追踪完整的DNS解析路径(+trace)、指定DNS服务器查询、反向解析，是DNS故障排查和域名配置验证的利器。",
    icon: "https://cdn-icons-png.flaticon.com/512/2920/2920235.png",
  },
  {
    label: "Nslookup",
    value: "nslookup",
    description:
      "交互式DNS查询工具，可查询域名对应的IP地址、反向DNS解析、指定DNS服务器查询、查看MX邮件交换记录。操作简单直观，支持交互模式和非交互模式，适合快速DNS检查、域名解析验证、邮件服务器配置检查。",
    icon: "https://cdn-icons-png.flaticon.com/512/1161/1161388.png",
  },
];

const ProbeSetupPage = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);

  // 从URL获取探针ID
  const probeId = route.query.id as string;

  // 表单数据
  const formState = ref({
    selectedTools: ["ping", "traceroute", "mtr"], // 默认选中3个工具
    selectedSources: ["1", "2"], // 默认选中NCBI和EMBL-EBI
    interval: 60, // 默认60秒
  });

  // 保存设置
  const handleSave = async () => {
    try {
      if (formState.value.selectedTools.length === 0) {
        message.warning("请至少选择一个探测工具");
        return;
      }

      if (formState.value.selectedSources.length === 0) {
        message.warning("请至少选择一个探测源");
        return;
      }

      if (!formState.value.interval || formState.value.interval < 1) {
        message.warning("请设置有效的探测时间间隔");
        return;
      }

      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("设置保存成功");
      // 保存成功后返回列表页
      router.push("/setting/probe");
    } catch (error) {
      message.error(`保存失败: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  // 取消返回
  const handleCancel = () => {
    router.push("/setting/probe");
  };

  // 切换工具选择状态
  const toggleTool = (toolValue: string) => {
    const index = formState.value.selectedTools.indexOf(toolValue);
    if (index > -1) {
      formState.value.selectedTools.splice(index, 1);
    } else {
      formState.value.selectedTools.push(toolValue);
    }
  };

  // 判断工具是否被选中
  const isToolSelected = (toolValue: string) => {
    return formState.value.selectedTools.includes(toolValue);
  };

  // 切换探测源选择状态
  const toggleSource = (sourceId: string) => {
    const index = formState.value.selectedSources.indexOf(sourceId);
    if (index > -1) {
      formState.value.selectedSources.splice(index, 1);
    } else {
      formState.value.selectedSources.push(sourceId);
    }
  };

  // 判断探测源是否被选中
  const isSourceSelected = (sourceId: string) => {
    return formState.value.selectedSources.includes(sourceId);
  };

  return () => (
    <div class="flex flex-col h-full">
      {/* 页面标题和返回按钮 */}
      <div class="flex items-center gap-4 p-4 border-b">
        <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} type="text" />
        <h2 class="text-xl font-semibold m-0">探针设置</h2>
      </div>

      {/* 表单内容 */}
      <div class="flex-1 p-4 overflow-auto">
        <Form layout="vertical">
          {/* 选择探测源 */}
          <Form.Item label="选择探测源">
            <Row gutter={[16, 16]}>
              {DETECTION_SOURCES.map((source) => {
                const selected = isSourceSelected(source.id);
                return (
                  <Col span={8} key={source.id}>
                    <div
                      class={[
                        "border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative",
                        selected ? "border-green-400 bg-green-50" : "border-gray-300 bg-white",
                      ]}
                      style={{ minHeight: "100px" }}
                      onClick={() => toggleSource(source.id)}
                    >
                      {/* 选中对号标记 */}
                      {selected && (
                        <div
                          class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          style={{ zIndex: 1 }}
                        >
                          <CheckOutlined style={{ color: "white", fontSize: "14px" }} />
                        </div>
                      )}

                      <div class="flex flex-col gap-2">
                        <div class="font-semibold text-base">{source.name}</div>
                        <div class="text-xs text-gray-600">{source.desc}</div>
                        <div class="text-xs text-blue-500 truncate" title={source.url}>
                          {source.url}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Form.Item>

          {/* 选择探测工具 */}
          <Form.Item label="选择网络探测工具">
            <Row gutter={[16, 16]}>
              {PROBE_TOOLS.map((tool) => {
                const selected = isToolSelected(tool.value);
                return (
                  <Col span={8} key={tool.value}>
                    <div
                      class={[
                        "border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer relative",
                        selected ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white",
                      ]}
                      style={{ minHeight: "120px" }}
                      onClick={() => toggleTool(tool.value)}
                    >
                      {/* 选中对号标记 */}
                      {selected && (
                        <div
                          class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          style={{ zIndex: 1 }}
                        >
                          <CheckOutlined style={{ color: "white", fontSize: "14px" }} />
                        </div>
                      )}

                      <div class="flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                          <img
                            src={tool.icon}
                            alt={tool.label}
                            style={{ width: "48px", height: "48px", objectFit: "contain" }}
                          />
                          <span class="font-semibold text-base">{tool.label}</span>
                        </div>
                        <div class="text-xs text-gray-600" title={tool.description}>
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Form.Item>

          {/* 探测时间间隔 */}
          <Form.Item label="探测时间间隔" help="设置探测任务的执行间隔时间">
            <Space>
              <InputNumber
                v-model:value={formState.value.interval}
                min={1}
                max={3600}
                style={{ width: "200px" }}
                addonAfter="秒"
              />
              <span class="text-gray-500">(建议设置在 60-300 秒之间)</span>
            </Space>
          </Form.Item>

          {/* 操作按钮 */}
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSave} loading={loading.value}>
                保存设置
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});

export default ProbeSetupPage;
