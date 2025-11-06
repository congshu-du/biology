import { Button, Space, Table, Tag, message } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import { ColumnProps } from "ant-design-vue/es/table";
import dayjs from "dayjs";
import { token } from "@/utils/theme";
import { useRouter } from "vue-router";

interface ProbeType {
  id: string;
  name: string;
  ip: string;
  location: string; // 位置
  dataCenter: string; // 机房
  connectivity: "connected" | "disconnected"; // 连通性
  status: "detecting" | "stopped"; // 状态：持续探测中、未开启探测
  createTime: string;
}

const ProbePage = defineComponent(() => {
  const loading = ref(false);
  const router = useRouter();

  // 探针数据
  const probeList = ref<ProbeType[]>([
    {
      id: "1",
      name: "探针1",
      ip: "192.168.1.100",
      location: "北京",
      dataCenter: "北京数据中心A",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 09:00:00",
    },
    {
      id: "2",
      name: "探针2",
      ip: "192.168.1.101",
      location: "上海",
      dataCenter: "上海数据中心B",
      connectivity: "connected",
      status: "stopped",
      createTime: "2024-01-15 08:00:00",
    },
    {
      id: "3",
      name: "探针3",
      ip: "192.168.1.102",
      location: "广州",
      dataCenter: "广州数据中心C",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 09:30:00",
    },
    {
      id: "4",
      name: "探针4",
      ip: "192.168.1.103",
      location: "深圳",
      dataCenter: "深圳数据中心D",
      connectivity: "disconnected",
      status: "stopped",
      createTime: "2024-01-15 07:00:00",
    },
    {
      id: "5",
      name: "探针5",
      ip: "192.168.1.104",
      location: "杭州",
      dataCenter: "杭州数据中心E",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 09:15:00",
    },
    {
      id: "6",
      name: "探针6",
      ip: "192.168.1.105",
      location: "成都",
      dataCenter: "成都数据中心F",
      connectivity: "connected",
      status: "stopped",
      createTime: "2024-01-15 06:00:00",
    },
    {
      id: "7",
      name: "探针7",
      ip: "192.168.1.106",
      location: "武汉",
      dataCenter: "武汉数据中心G",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 09:45:00",
    },
    {
      id: "8",
      name: "探针8",
      ip: "192.168.1.107",
      location: "南京",
      dataCenter: "南京数据中心H",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 09:20:00",
    },
    {
      id: "9",
      name: "探针9",
      ip: "192.168.1.108",
      location: "西安",
      dataCenter: "西安数据中心I",
      connectivity: "disconnected",
      status: "stopped",
      createTime: "2024-01-15 05:30:00",
    },
    {
      id: "10",
      name: "探针10",
      ip: "192.168.1.109",
      location: "重庆",
      dataCenter: "重庆数据中心J",
      connectivity: "connected",
      status: "detecting",
      createTime: "2024-01-15 10:00:00",
    },
  ]);

  // 连通性标签颜色映射
  const connectivityColorMap = {
    connected: token.colorSuccess,
    disconnected: token.colorError,
  };

  const connectivityTextMap = {
    connected: "已联通",
    disconnected: "未联通",
  };

  // 状态标签颜色映射
  const statusColorMap = {
    detecting: token.colorPrimary,
    stopped: "default",
  };

  const statusTextMap = {
    detecting: "持续探测中",
    stopped: "未开启探测",
  };

  // 开启探针
  const startProbe = async (probe: ProbeType) => {
    try {
      loading.value = true;
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const probeIndex = probeList.value.findIndex((p) => p.id === probe.id);
      if (probeIndex !== -1) {
        probeList.value[probeIndex].status = "detecting";
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

  // 查看详情
  const viewDetail = (probe: ProbeType) => {
    router.push(`/setting/probe/detail?id=${probe.id}`);
  };

  // 设置探针
  const settingProbe = (probe: ProbeType) => {
    router.push(`/setting/probe/setup?id=${probe.id}`);
  };

  const columns: ColumnProps<ProbeType>[] = [
    {
      title: "探针名称",
      dataIndex: "name",
      width: 120,
      ellipsis: true,
    },
    {
      title: "IP",
      dataIndex: "ip",
      width: 140,
      ellipsis: true,
    },
    {
      title: "位置",
      dataIndex: "location",
      width: 100,
      ellipsis: true,
    },
    {
      title: "机房",
      dataIndex: "dataCenter",
      width: 180,
      ellipsis: true,
    },
    {
      title: "连通性",
      dataIndex: "connectivity",
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={connectivityColorMap[text]}>{connectivityTextMap[text]}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      customRender: ({ text }) => {
        return <Tag color={statusColorMap[text]}>{statusTextMap[text]}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      fixed: "right",
      customRender: ({ record }) => (
        <Space>
          {record.status === "detecting" ? (
            <Button type="link" danger size="small" onClick={() => stopProbe(record)} loading={loading.value}>
              停止
            </Button>
          ) : (
            <Button type="link" size="small" onClick={() => startProbe(record)} loading={loading.value}>
              启动
            </Button>
          )}
          <Button size="small" type="link" onClick={() => settingProbe(record)}>
            设置
          </Button>
          <Button size="small" type="link" onClick={() => viewDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">探针列表</h2>
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
    </div>
  );
});

export default ProbePage;
