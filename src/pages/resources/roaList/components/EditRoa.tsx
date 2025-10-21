import { getCafileDetail, saveRoaAuthorized } from "@/services/roa";
import { CaFileType, RoaType } from "@/services/roa/interface";
import { AutoComplete, Form, FormInstance, InputNumber, message, Modal, Select } from "ant-design-vue";
import { computed, defineComponent, reactive, Ref, ref, watchEffect } from "vue";

const reg =
  /^((([0-9]{1,3}\.){3}[0-9]{1,3})|(?!.*::.*::)([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,7}|::|([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6})?::([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6})?))(\/(3[0-2]|[1-2]?[0-9]|[0-9]|12[0-8]))$/;

const EditRoa = defineComponent<{
  onClose: (flag?: boolean) => void;
  info: Ref<RoaType | undefined>;
  fileList: CaFileType[];
}>(
  ({ onClose, info, fileList }) => {
    const formRef = ref<FormInstance>();
    const loading = ref(false);
    const fileInfo = ref<CaFileType>();

    const formData = reactive<{ caId?: number; ipPrefix?: string; maxPrefixLength?: number; asn?: number }>({
      caId: info.value?.caId,
      ipPrefix: info.value?.ipPrefix,
      asn: info.value?.asn,
      maxPrefixLength: info.value?.maxPrefixLength,
    });

    watchEffect(async () => {
      if (formData.caId) {
        const res = await getCafileDetail(formData.caId);
        if (res.code === 200) {
          fileInfo.value = res.data ?? undefined;
        }
      }
    });

    const maxLenData = computed(() => {
      if (!formData.ipPrefix || !reg.test(formData.ipPrefix)) {
        return [];
      } else {
        const max = formData.ipPrefix.includes(":") ? 128 : 32;
        const min = formData.ipPrefix.slice(formData.ipPrefix.indexOf("/") + 1);
        return [Number(min), max];
      }
    });

    const onOk = async () => {
      try {
        console.log(formData, "onOk");
        await formRef.value?.validate();
        loading.value = true;

        const res = await saveRoaAuthorized({
          id: info.value?.id,
          caId: formData.caId!,
          ipPrefix: formData.ipPrefix!,
          asn: Number(formData.asn!),
          maxPrefixLength: formData.maxPrefixLength!,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        message.success("授权成功");
        onClose(true);
        loading.value = false;
      } catch (error) {
        console.log(error);
        loading.value = false;
      }
    };

    return () => (
      <Modal confirmLoading={loading.value} title="授权" onCancel={() => onClose()} onOk={onOk} open>
        <Form labelCol={{ flex: "110px" }} ref={formRef} class="mt-4" model={formData}>
          <Form.Item label="证书名称" name="caId" rules={[{ required: true, message: "请选择证书名称" }]}>
            <Select
              v-model:value={formData.caId}
              showSearch
              options={fileList.map((n) => ({ label: n.caFileName, value: n.id }))}
              placeholder="请选择证书"
              filterOption={(inputValue, option) => {
                return option?.label?.includes(inputValue);
              }}
              disabled={info.value?.id !== undefined}
            />
          </Form.Item>
          <Form.Item
            label="AS号"
            name="asn"
            rules={[
              { required: true, message: "请输入AS号" },
              { pattern: /^\d+$/, message: "请输入数字" },
            ]}
          >
            <AutoComplete
              v-model:value={formData.asn}
              placeholder="请输入AS号"
              filterOption={(inputValue, option) => {
                return option?.value?.includes(inputValue);
              }}
              options={fileInfo.value?.asnList?.map((n) => ({ value: n + "" })) ?? []}
            />
          </Form.Item>
          <Form.Item
            label="IP前缀"
            name="ipPrefix"
            rules={[
              { required: true, message: "请输入Ip前缀" },
              {
                pattern: reg,
                message: "请输入正确的IP前缀",
              },
            ]}
          >
            <AutoComplete
              disabled={info.value?.id !== undefined}
              v-model:value={formData.ipPrefix}
              filterOption={(inputValue, option) => {
                return option?.value?.includes(inputValue);
              }}
              options={fileInfo.value?.ipPrefixList?.map((n) => ({ value: n })) ?? []}
              placeholder="请输入Ip前缀"
            />
          </Form.Item>
          <Form.Item
            label="前缀最大长度"
            name="maxPrefixLength"
            rules={[
              { required: true, message: "请输入前缀最大长度" },
              {
                validator: (_, value) => {
                  console.log(value, 6666);
                  if (
                    value !== undefined &&
                    value !== null &&
                    (value < maxLenData.value[0] || value > maxLenData.value[1])
                  ) {
                    return Promise.reject(`请输入${maxLenData.value[0]}-${maxLenData.value[1]}之间的数字`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              disabled={maxLenData.value.length === 0}
              precision={0}
              class="w-full"
              v-model:value={formData.maxPrefixLength}
              placeholder="请输入前缀最大长度"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
  {
    props: ["onClose", "info", "fileList"],
  },
);

export default EditRoa;
