import { Button, Space, Table, Modal, Form, Input, message } from "ant-design-vue";
import { defineComponent, ref, reactive, computed } from "vue";
import { ColumnProps } from "ant-design-vue/es/table";
import dayjs from "dayjs";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons-vue";

interface WhitelistType {
  id: string;
  name: string;
  ip: string;
  desc: string;
  createTime: string;
  updateTime: string;
}

const WhitelistPage = defineComponent(() => {
  const loading = ref(false);
  const modalVisible = ref(false);
  const modalTitle = ref("添加白名单");
  const formRef = ref();
  const searchText = ref("");

  const formState = reactive<Partial<WhitelistType>>({
    id: undefined,
    name: "",
    ip: "",
    desc: "",
  });

  // 白名单数据
  const whitelistData = ref<WhitelistType[]>([
    {
      id: "1",
      name: "内部服务器",
      ip: "192.168.1.100",
      desc: "公司内部核心服务器",
      createTime: "2024-01-15 09:00:00",
      updateTime: "2024-01-15 09:00:00",
    },
    {
      id: "2",
      name: "开发环境",
      ip: "10.0.0.50",
      desc: "开发测试环境服务器",
      createTime: "2024-01-15 08:00:00",
      updateTime: "2024-01-15 08:00:00",
    },
    {
      id: "3",
      name: "备份服务器",
      ip: "172.16.0.20",
      desc: "数据备份专用服务器",
      createTime: "2024-01-15 07:00:00",
      updateTime: "2024-01-15 07:00:00",
    },
  ]);

  // 过滤后的数据
  const filteredData = computed(() => {
    if (!searchText.value) {
      return whitelistData.value;
    }
    const keyword = searchText.value.toLowerCase();
    return whitelistData.value.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.ip.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword),
    );
  });

  // 打开添加弹窗
  const openAddModal = () => {
    modalTitle.value = "添加白名单";
    formState.id = undefined;
    formState.name = "";
    formState.ip = "";
    formState.desc = "";
    modalVisible.value = true;
  };

  // 打开编辑弹窗
  const openEditModal = (record: WhitelistType) => {
    modalTitle.value = "编辑白名单";
    formState.id = record.id;
    formState.name = record.name;
    formState.ip = record.ip;
    formState.desc = record.desc;
    modalVisible.value = true;
  };

  // 关闭弹窗
  const closeModal = () => {
    modalVisible.value = false;
    formRef.value?.resetFields();
  };

  // IP地址验证
  const validateIP = (ip: string): boolean => {
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 手动验证
      if (!formState.name || formState.name.trim() === "") {
        message.warning("请输入名称");
        return;
      }
      if (!formState.ip || formState.ip.trim() === "") {
        message.warning("请输入IP地址");
        return;
      }
      // IP地址格式验证
      if (!validateIP(formState.ip)) {
        message.warning("请输入有效的IP地址");
        return;
      }

      loading.value = true;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      if (formState.id) {
        // 编辑
        const index = whitelistData.value.findIndex((item) => item.id === formState.id);
        if (index !== -1) {
          whitelistData.value[index] = {
            ...whitelistData.value[index],
            name: formState.name!,
            ip: formState.ip!,
            desc: formState.desc || "",
            updateTime: currentTime,
          };
          message.success("编辑成功");
        }
      } else {
        // 添加
        const newWhitelist: WhitelistType = {
          id: Date.now().toString(),
          name: formState.name!,
          ip: formState.ip!,
          desc: formState.desc || "",
          createTime: currentTime,
          updateTime: currentTime,
        };
        whitelistData.value.unshift(newWhitelist);
        message.success("添加成功");
      }

      closeModal();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      loading.value = false;
    }
  };

  // 删除白名单
  const handleDelete = (record: WhitelistType) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除白名单 "${record.name}" 吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          loading.value = true;
          await new Promise((resolve) => setTimeout(resolve, 500));

          const index = whitelistData.value.findIndex((item) => item.id === record.id);
          if (index !== -1) {
            whitelistData.value.splice(index, 1);
            message.success("删除成功");
          }
        } catch (error) {
          message.error(`删除失败: ${error}`);
        } finally {
          loading.value = false;
        }
      },
    });
  };

  const columns: ColumnProps<WhitelistType>[] = [
    {
      title: "名称",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      width: 180,
      ellipsis: true,
    },
    {
      title: "描述",
      dataIndex: "desc",
      width: 300,
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      customRender: ({ text }) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      width: 180,
      customRender: ({ text }) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 150,
      fixed: "right",
      customRender: ({ record }) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div class="text-xl font-semibold">监测白名单</div>
          <Space>
            <Input
              v-model:value={searchText.value}
              placeholder="搜索名称、IP地址或描述"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: "260px" }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
              添加白名单
            </Button>
          </Space>
        </div>
      </div>

      <div class="flex-1 overflow-y-hidden px-4">
        <Table
          columns={columns}
          size="large"
          row-key={(record: WhitelistType) => record.id}
          data-source={filteredData.value}
          loading={loading.value}
          pagination={false}
        />
      </div>

      {/* 添加/编辑弹窗 */}
      <Modal
        v-model:open={modalVisible.value}
        title={modalTitle.value}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={loading.value}
        width={600}
      >
        <Form ref={formRef} model={formState} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="名称" name="name">
            <Input v-model:value={formState.name} placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="IP地址" name="ip">
            <Input v-model:value={formState.ip} placeholder="请输入IP地址，如：192.168.1.1" />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input.TextArea
              v-model:value={formState.desc}
              placeholder="请输入描述信息"
              rows={4}
              maxlength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default WhitelistPage;
