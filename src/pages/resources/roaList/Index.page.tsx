import { computed, defineComponent, nextTick, reactive, ref, watchEffect } from "vue";
import Certificatelist from "./components/Certificatelist";
import { token } from "@/utils/theme";
import { Button, Input, message, Modal, Select, Space, Table } from "ant-design-vue";
import { getCafileListPage, getRoaListPage, revokeRoaAuthorized } from "@/services/roa";
import {
  CloseCircleFilled,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons-vue";
import { CaFileType, RoaType } from "@/services/roa/interface";
import dayjs from "dayjs";
import { getStatusUi, statusOptions } from "./components/common";
import { useRoute, useRouter } from "vue-router";
import EditRoa from "./components/EditRoa";
import { ColumnProps, TableProps } from "ant-design-vue/es/table";
import { getIPprefixUrl } from "@/utils/config";

let toFirshPage = true;

const PrefixList = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const open = ref(false);
  const fileInfo = ref<CaFileType>();
  const list = ref<RoaType[]>([]);
  const loading = ref(false);
  const fileList = ref<CaFileType[]>([]);
  const info = ref<RoaType>();
  const refresh = ref(false);
  const targetNode = ref<any>(null);
  const initHeight = ref<number>(0);
  const pagination = reactive({
    current: 1,
    pageSize: 100,
    pageSizeOptions: ["100", "200", "300"],
    total: 0,
    showTotal: (total: number) => (
      <span>
        共 <a>{total}</a> 条
      </span>
    ),
  });

  const param = reactive({
    current: 1,
    pageSize: 100,
    sourceType: 2,
    authStatus: undefined,
    asn: route.query?.asn,
    ipPrefix: route.query?.ipPrefix,
  });

  nextTick(() => {
    // if (targetNode.value) {
    const ro = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      initHeight.value = height as number;
    });
    ro.observe(targetNode.value);
    // }
  });

  watchEffect(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      refresh.value;
      const res = await getCafileListPage({
        current: 1,
        pageSize: 10000,
      });
      if (res.code !== 200) {
        throw new Error();
      }
      fileList.value = res.data.data ?? [];
    } catch (error) {
      // Intentionally ignored
    }
  });

  const fileListObj = computed(() => {
    return fileList.value.reduce((prev: Record<number, CaFileType>, cur) => {
      prev[cur.id] = cur;
      return prev;
    }, {});
  });

  watchEffect(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      refresh.value;
      if (toFirshPage) {
        param.current = 1;
      }
      loading.value = true;
      const res = await getRoaListPage({
        ...param,
        caId: fileInfo.value?.id,
      });
      if (res.code !== 200) {
        throw new Error();
      }
      list.value = res.data.data;
      pagination.current = res.data.current;
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      loading.value = false;
      toFirshPage = true;
    } catch (error) {
      loading.value = false;
      toFirshPage = true;
    }
  });

  const columns = computed(() => {
    const col: ColumnProps<RoaType>[] = [
      {
        title: "AS号",
        dataIndex: "asn",
        customRender: ({ text }) => text && <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>,
      },
      {
        title: "IP前缀",
        dataIndex: "ipPrefix",
        ellipsis: true,
        customRender: ({ text }) => {
          if (!text) return "-";
          return <a onClick={() => window.open(getIPprefixUrl(text))}>{text}</a>;
        },
      },
      {
        title: "最大前缀长度",
        dataIndex: "maxPrefixLength",
      },
      {
        title: "所属证书",
        dataIndex: "caId",
        ellipsis: true,
        width: 280,
        customRender: ({ text: caId }) => fileListObj.value[caId]?.caFileName,
      },
      {
        title: "分配状态",
        dataIndex: "authStatus",
        className: "!p-2",
        customRender: ({ text: authStatus }) => getStatusUi(authStatus),
      },
      {
        title: "生效时间",
        dataIndex: "effectiveStartTime",
        ellipsis: true,
        customRender: ({ text: time }) => time && dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "过期时间",
        dataIndex: "effectiveEndTime",
        ellipsis: true,
        customRender: ({ text: time }) => time && dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "操作",
        width: 66,
        customRender: ({ record }) => (
          <span>
            {record.authStatus !== 2 ? (
              <a
                onClick={() => {
                  info.value = record;
                  open.value = true;
                }}
              >
                <SafetyCertificateOutlined /> 授权
              </a>
            ) : (
              <a onClick={() => onConfirm(record.id!)} style={{ color: token.colorError }}>
                <RollbackOutlined /> 撤销
              </a>
            )}
          </span>
        ),
      },
    ];
    return col;
  });

  const onConfirm = (id: number) => {
    Modal.confirm({
      title: "确认要撤销ROA验证吗？",
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const res = await revokeRoaAuthorized(id);
        if (res.code === 200) {
          message.success("撤销成功");
        }
        refresh.value = !refresh.value;
        toFirshPage = false;
      },
    });
  };

  const onClose = (flag?: boolean) => {
    open.value = false;
    if (flag) {
      refresh.value = !refresh.value;
      toFirshPage = false;
    }
  };

  const onFresh = () => {
    refresh.value = !refresh.value;
  };

  const handleTableChange: TableProps["onChange"] = (pag) => {
    param.pageSize = pag.pageSize || 50;
    param.current = pag?.current || 1;
    toFirshPage = false;
  };
  return () => (
    <div style={{ borderTop: `1px solid ${token.colorBorder}` }} class="h-full w-full flex">
      <div class="w-[300px]">
        <Certificatelist fileList={fileList} value={fileInfo} onFresh={onFresh} />
      </div>
      <div class="flex-1 flex flex-col overflow-hidden">
        <div
          style={{ borderBottom: `1px solid ${token.colorBorder}` }}
          class="flex items-center justify-between h-12 px-3"
        >
          <Space>
            <Input placeholder="请输入AS" type="number" allowClear v-model={[param.asn, "value"]} class="w-36" />
            <Input placeholder="请输入前缀" allowClear v-model={[param.ipPrefix, "value"]} class="w-36" />
            <Select
              placeholder="请选择分配状态"
              v-model={[param.authStatus, "value"]}
              options={statusOptions}
              class="w-36"
              allowClear
            />
            {fileInfo.value && (
              <Button>
                {fileInfo.value.caFileName}{" "}
                <CloseCircleFilled
                  style={{ color: token.colorTextQuaternary, fontSize: "12px" }}
                  onClick={() => (fileInfo.value = undefined)}
                />
              </Button>
            )}
          </Space>
          <Button
            onClick={() => {
              open.value = true;
              if (fileInfo.value) {
                info.value = {
                  caId: fileInfo.value?.id,
                } as RoaType;
              } else {
                info.value = undefined;
              }
            }}
            icon={<PlusOutlined />}
            type="primary"
          >
            签发ROA
          </Button>
        </div>
        <div ref={targetNode} class="mx-3 my-2 flex-1 flex flex-col overflow-hidden">
          <Table
            columns={columns.value}
            size="middle"
            loading={loading.value}
            dataSource={list.value}
            pagination={pagination}
            scroll={{ y: initHeight.value - 94 }}
            onChange={handleTableChange}
          />
        </div>
      </div>
      {open.value && <EditRoa fileList={fileList.value} info={info} onClose={onClose} />}
    </div>
  );
});

export default PrefixList;
