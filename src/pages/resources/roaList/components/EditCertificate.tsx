import { updateCaFile } from "@/services/roa";
import { CaFileType } from "@/services/roa/interface";
import { token } from "@/utils/theme";
import { InboxOutlined } from "@ant-design/icons-vue";
import { Form, FormInstance, Input, message, Modal, Upload } from "ant-design-vue";
import { defineComponent, PropType, Reactive, reactive, Ref, ref } from "vue";

const EditCertificate = defineComponent<{ onClose: (flag?: boolean) => void; info: Ref<CaFileType | undefined> }>(
  ({ onClose, info }) => {
    const formRef = ref<FormInstance>();
    const loading = ref(false);

    const formData = reactive<{ caFileName?: string }>({
      caFileName: info.value!.caFileName,
    });

    const onOk = async () => {
      try {
        await formRef.value?.validate();
        loading.value = true;

        const res = await updateCaFile({ id: info.value!.id, caFileName: formData.caFileName });
        if (res.code !== 200) {
          throw new Error();
        }
        message.success("修改成功");
        onClose(true);
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    };

    return () => (
      <Modal confirmLoading={loading.value} title="编辑证书" onCancel={() => onClose()} onOk={onOk} open>
        <Form ref={formRef} class="mt-4" model={formData}>
          <Form.Item
            label="地址证书名称"
            name="caFileName"
            rules={[
              { required: true, message: "请输入地址证书名称" },
              { max: 64, message: "最多输入64个字符" },
            ]}
          >
            <Input v-model={[formData.caFileName, "value"]} placeholder="请输入地址证书名称" />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
  {
    props: ["onClose", "info"],
  },
);

export default EditCertificate;
