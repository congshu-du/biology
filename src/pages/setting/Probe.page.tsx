import { Button, Modal, Space, Table, Tag, message } from "ant-design-vue";
import { defineComponent, ref, reactive } from "vue";
import { ColumnProps } from "ant-design-vue/es/table";
import dayjs from "dayjs";
import { token } from "@/utils/theme";

interface ProbeType {
  id: string;
  name: string;
  service: string;
  status: "running" | "stopped" | "error";
  interval: number; // 执行间隔（秒）
  lastExecuteTime?: string;
  createTime: string;
}

const ProbePage = defineComponent(() => {
  const showModal = ref(false);
  const loading = ref(false);

  // 探针数据
  const probeList = ref<ProbeType[]>([
    {
      id: "1",
      name: "探针1",
      service: "192.168.1.100",
      status: "running",
      interval: 60,
      lastExecuteTime: "2024-01-15 10:30:00",
      createTime: "2024-01-15 09:00:00",
    },
    {
      id: "2",
      name: "探针2",
      service: "192.168.1.101",
      status: "stopped",
      interval: 300,
      lastExecuteTime: "2024-01-15 08:00:00",
      createTime: "2024-01-15 08:00:00",
    },
    {
      id: "3",
      name: "探针3",
      service: "192.168.1.102",
      status: "running",
      interval: 120,
      lastExecuteTime: "2024-01-15 10:25:00",
      createTime: "2024-01-15 09:30:00",
    },
    {
      id: "4",
      name: "探针4",
      service: "192.168.1.103",
      status: "error",
      interval: 180,
      lastExecuteTime: "2024-01-15 07:30:00",
      createTime: "2024-01-15 07:00:00",
    },
    {
      id: "5",
      name: "探针5",
      service: "192.168.1.104",
      status: "running",
      interval: 90,
      lastExecuteTime: "2024-01-15 10:35:00",
      createTime: "2024-01-15 09:15:00",
    },
    {
      id: "6",
      name: "探针6",
      service: "192.168.1.105",
      status: "stopped",
      interval: 240,
      lastExecuteTime: "2024-01-15 06:00:00",
      createTime: "2024-01-15 06:00:00",
    },
    {
      id: "7",
      name: "探针7",
      service: "192.168.1.106",
      status: "running",
      interval: 150,
      lastExecuteTime: "2024-01-15 10:40:00",
      createTime: "2024-01-15 09:45:00",
    },
    {
      id: "8",
      name: "探针8",
      service: "192.168.1.107",
      status: "running",
      interval: 200,
      lastExecuteTime: "2024-01-15 10:20:00",
      createTime: "2024-01-15 09:20:00",
    },
    {
      id: "9",
      name: "探针9",
      service: "192.168.1.108",
      status: "stopped",
      interval: 360,
      lastExecuteTime: "2024-01-15 05:30:00",
      createTime: "2024-01-15 05:30:00",
    },
    {
      id: "10",
      name: "探针10",
      service: "192.168.1.109",
      status: "running",
      interval: 75,
      lastExecuteTime: "2024-01-15 10:45:00",
      createTime: "2024-01-15 10:00:00",
    },
  ]);

  // 新增探针表单数据
  const newProbe = reactive({
    name: "",
    service: "",
    interval: 60,
  });

  // 生成下一个探针编号
  const getNextProbeNumber = () => {
    const existingNumbers = probeList.value.map((p) => parseInt(p.name.replace("探针", "")));
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    return maxNumber + 1;
  };

  // 更新新增探针时的名称
  const showAddModal = () => {
    newProbe.name = `探针${getNextProbeNumber()}`;
    showModal.value = true;
  };

  // 状态标签颜色映射
  const statusColorMap = {
    running: token.colorSuccess,
    stopped: "default",
    error: token.colorError,
  };

  const statusTextMap = {
    running: "运行中",
    stopped: "已停止",
    error: "错误",
  };

  // 开启探针
  const startProbe = async (probe: ProbeType) => {
    try {
      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const probeIndex = probeList.value.findIndex((p) => p.id === probe.id);
      if (probeIndex !== -1) {
        probeList.value[probeIndex].status = "running";
        probeList.value[probeIndex].lastExecuteTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        message.success(`探针 "${probe.name}" 已启动`);
      }
    } catch (error) {
      message.error(`启动探针失败: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  // 停止探针
  const stopProbe = async (probe: ProbeType) => {
    try {
      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const probeIndex = probeList.value.findIndex((p) => p.id === probe.id);
      if (probeIndex !== -1) {
        probeList.value[probeIndex].status = "stopped";
        message.success(`探针 "${probe.name}" 已停止`);
      }
    } catch (error) {
      message.error(`停止探针失败: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  // 添加探针
  const addProbe = async () => {
    if (!newProbe.service) {
      message.error("请填写IP地址");
      return;
    }

    try {
      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProbeItem: ProbeType = {
        id: Date.now().toString(),
        name: newProbe.name,
        service: newProbe.service,
        status: "stopped",
        interval: newProbe.interval,
        createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      probeList.value.unshift(newProbeItem);

      // 重置表单
      newProbe.name = `探针${getNextProbeNumber()}`;
      newProbe.service = "";
      newProbe.interval = 60;

      showModal.value = false;
      message.success("探针添加成功");
    } catch (error) {
      message.error(`添加探针失败: ${error}`);
    } finally {
      loading.value = false;
    }
  };

  const columns: ColumnProps<ProbeType>[] = [
    {
      title: "探针名称",
      dataIndex: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "所属服务",
      dataIndex: "service",
      width: 140,
      ellipsis: true,
      customRender: ({ text }) => {
        return text || "-";
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={statusColorMap[text]}>{statusTextMap[text]}</Tag>;
      },
    },
    {
      title: "执行间隔",
      dataIndex: "interval",
      width: 100,
      customRender: ({ text }) => {
        return `${text}秒`;
      },
    },
    {
      title: "最近执行时间",
      dataIndex: "lastExecuteTime",
      width: 200,
      customRender: ({ text }) => {
        return text || "-";
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 200,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 150,
      fixed: "right",
      customRender: ({ record }) => (
        <Space>
          {record.status === "running" ? (
            <Button type="primary" danger size="small" onClick={() => stopProbe(record)} loading={loading.value}>
              停止
            </Button>
          ) : (
            <Button type="primary" size="small" onClick={() => startProbe(record)} loading={loading.value}>
              启动
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">探针列表</h2>
          <Button type="primary" onClick={showAddModal}>
            添加探针
          </Button>
        </div>
      </div>

      <div class="flex-1 overflow-y-hidden px-4">
        <Table
          columns={columns}
          size="large"
          row-key={(record: ProbeType) => record.id}
          data-source={probeList.value}
          loading={loading.value}
          pagination={false}
          // scroll={{ y: 500 }}
        />
      </div>

      {/* 添加探针弹窗 */}
      <Modal
        title="添加探针"
        open={showModal.value}
        onCancel={() => (showModal.value = false)}
        footer={null}
        width={600}
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">探针名称</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              v-model={[newProbe.name, "value"]}
              placeholder="自动生成"
              readonly
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">IP地址</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model={[newProbe.service, "value"]}
              placeholder="请输入IP地址"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">执行间隔（秒）</label>
            <input
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model={[newProbe.interval, "value"]}
              min="10"
              step="10"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <Button onClick={() => (showModal.value = false)}>取消</Button>
            <Button type="primary" onClick={addProbe} loading={loading.value}>
              添加
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default ProbePage;
