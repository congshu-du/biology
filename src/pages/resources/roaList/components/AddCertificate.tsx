import { addCaFile } from "@/services/roa";
import { token } from "@/utils/theme";
import { InboxOutlined } from "@ant-design/icons-vue";
import { Form, FormInstance, Input, message, Modal, Upload } from "ant-design-vue";
import { defineComponent, PropType, reactive, ref } from "vue";
import CryptoJS from "crypto-js";
import { CaFileType } from "@/services/roa/interface";

function getFileMD5(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binary = e.target.result;
      const md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(binary)).toString();
      resolve(md5);
    };

    reader.onerror = (e) => {
      reject("");
    };

    reader.readAsArrayBuffer(file);
  });
}

const AddCertificate = defineComponent<{ onClose: (flag?: boolean) => void; fileList: CaFileType[] }>(
  ({ onClose, fileList }) => {
    const formRef = ref<FormInstance>();
    const loading = ref(false);

    const formData = reactive<{ name?: string; file?: any; fileMd5?: string }>({
      name: undefined,
      file: undefined,
      fileMd5: undefined,
    });

    const onOk = async () => {
      try {
        await formRef.value?.validate();
        loading.value = true;
        const fromData = new FormData();
        fromData.append("fileName", formData.name + "");
        fromData.append("fileMd5", formData.fileMd5 + "");
        fromData.append("file", formData.file[0]?.originFileObj);
        const res = await addCaFile(fromData);
        if (res.code !== 200) {
          throw new Error();
        }
        message.success("上传成功");
        onClose(true);
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    };

    return () => (
      <Modal confirmLoading={loading.value} title="上传证书" onCancel={() => onClose()} onOk={onOk} open>
        <Form ref={formRef} class="mt-4" model={formData}>
          <Form.Item
            label="地址证书名称"
            name="name"
            rules={[
              { required: true, message: "请输入地址证书名称" },
              { max: 64, message: "最多输入64个字符" },
            ]}
          >
            <Input v-model={[formData.name, "value"]} placeholder="请输入地址证书名称" />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "请上传地址证书" },
              {
                validator: async (_, file) => {
                  if (file && file[0]) {
                    const getFileMD5Res = await getFileMD5(file[0]?.originFileObj);
                    if (getFileMD5Res) {
                      formData.fileMd5 = getFileMD5Res as string;
                    }

                    if (fileList.findIndex((n) => n.caFileMd5 === getFileMD5Res) > -1) {
                      return Promise.reject("已上传过该证书！");
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name="file"
          >
            <Upload.Dragger
              beforeUpload={async (file) => {
                if (file.size > 2 * 1024 * 1024) {
                  message.error("请上传一个小于2M的.cer证书");
                  return Upload.LIST_IGNORE;
                }

                const name = file.name.slice(0, file.name.lastIndexOf("."));
                if (!formData.name && name) {
                  formData.name = name;
                }
                return false;
              }}
              accept=".cer"
              maxCount={1}
              action=""
              v-model={[formData.file, "fileList"]}
            >
              <p class="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p style={{ color: token.colorTextTertiary }}>点击或拖拽文件到此区域去上传</p>
              <p style={{ color: token.colorTextTertiary }}>请上传一个小于2M的.cer证书</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    );
  },
  {
    props: ["onClose", "fileList"],
  },
);

export default AddCertificate;
