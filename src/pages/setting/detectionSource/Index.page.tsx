import { Button, Space, Table, Modal, Form, Input, message } from "ant-design-vue";
import { defineComponent, ref, reactive } from "vue";
import { ColumnProps } from "ant-design-vue/es/table";
import dayjs from "dayjs";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

interface DetectionSourceType {
  id: string;
  name: string;
  url: string;
  desc: string;
  createTime: string;
  updateTime: string;
}

const DetectionSourcePage = defineComponent(() => {
  const loading = ref(false);
  const modalVisible = ref(false);
  const modalTitle = ref("添加探测源");
  const formRef = ref();

  const formState = reactive<Partial<DetectionSourceType>>({
    id: undefined,
    name: "",
    url: "",
    desc: "",
  });

  const detectionSourceList = ref<DetectionSourceType[]>([
    {
      id: "1",
      name: "NCBI",
      url: "https://www.ncbi.nlm.nih.gov",
      desc: "美国国家生物技术信息中心",
      createTime: "2024-01-15 09:00:00",
      updateTime: "2024-01-15 09:00:00",
    },
    {
      id: "2",
      name: "EMBL-EBI",
      url: "https://www.ebi.ac.uk",
      desc: "欧洲分子生物学实验室欧洲生物信息学研究所",
      createTime: "2024-01-15 08:00:00",
      updateTime: "2024-01-15 08:00:00",
    },
    {
      id: "3",
      name: "DDBJ",
      url: "https://www.ddbj.nig.ac.jp",
      desc: "日本DNA数据库",
      createTime: "2024-01-15 07:00:00",
      updateTime: "2024-01-15 07:00:00",
    },
  ]);

  const openAddModal = () => {
    modalTitle.value = "添加探测源";
    formState.id = undefined;
    formState.name = "";
    formState.url = "";
    formState.desc = "";
    modalVisible.value = true;
  };

  const openEditModal = (record: DetectionSourceType) => {
    modalTitle.value = "编辑探测源";
    formState.id = record.id;
    formState.name = record.name;
    formState.url = record.url;
    formState.desc = record.desc;
    modalVisible.value = true;
  };

  const closeModal = () => {
    modalVisible.value = false;
    formRef.value?.resetFields();
  };

  const handleSubmit = async () => {
    try {
      // Manual validation
      if (!formState.name || formState.name.trim() === "") {
        message.warning("请输入探测源名称");
        return;
      }
      if (!formState.url || formState.url.trim() === "") {
        message.warning("请输入URL地址");
        return;
      }
      // Simple URL validation
      try {
        new URL(formState.url);
      } catch {
        message.warning("请输入有效的URL地址");
        return;
      }

      loading.value = true;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      if (formState.id) {
        const index = detectionSourceList.value.findIndex((item) => item.id === formState.id);
        if (index !== -1) {
          detectionSourceList.value[index] = {
            ...detectionSourceList.value[index],
            name: formState.name!,
            url: formState.url!,
            desc: formState.desc || "",
            updateTime: currentTime,
          };
          message.success("编辑成功");
        }
      } else {
        const newSource: DetectionSourceType = {
          id: Date.now().toString(),
          name: formState.name!,
          url: formState.url!,
          desc: formState.desc || "",
          createTime: currentTime,
          updateTime: currentTime,
        };
        detectionSourceList.value.unshift(newSource);
        message.success("添加成功");
      }

      closeModal();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const handleDelete = (record: DetectionSourceType) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除探测源 "${record.name}" 吗？`,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          loading.value = true;
          await new Promise((resolve) => setTimeout(resolve, 500));

          const index = detectionSourceList.value.findIndex((item) => item.id === record.id);
          if (index !== -1) {
            detectionSourceList.value.splice(index, 1);
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

  const columns: ColumnProps<DetectionSourceType>[] = [
    {
      title: "探测源名称",
      dataIndex: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "URL地址",
      dataIndex: "url",
      width: 300,
      ellipsis: true,
      customRender: ({ text }) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "描述",
      dataIndex: "desc",
      width: 250,
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
        <div class="flex items-center justify-between ">
          <h2 class="text-xl font-semibold">探测源管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            添加探测源
          </Button>
        </div>
      </div>

      <div class="flex-1 overflow-y-hidden px-4">
        <Table
          columns={columns}
          size="large"
          row-key={(record: DetectionSourceType) => record.id}
          data-source={detectionSourceList.value}
          loading={loading.value}
          pagination={false}
        />
      </div>

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
            <Input v-model:value={formState.name} placeholder="请输入探测源名称" />
          </Form.Item>
          <Form.Item label="URL地址" name="url">
            <Input v-model:value={formState.url} placeholder="请输入URL地址，如：https://example.com" />
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

export default DetectionSourcePage;
